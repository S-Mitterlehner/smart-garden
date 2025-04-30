using System.Linq.Expressions;

namespace SmartGarden.Automation.RulesEngine;

public class RulesEngine(string rule)
{
    private readonly ParameterExpression _parameters = Expression.Parameter(typeof(Dictionary<string, object>), "parameters");
    private readonly string[] _tokens = rule.Split(' ');
    private int _current = 0;

    private string CurrentToken => _tokens[_current];
    private bool IsEnd => _current >= _tokens.Length;

    public RuleEvaluator Parse()
    {
        var expr = ParseOr();
        if (_current < _tokens.Length)
            throw new Exception($"Unexpected token: {CurrentToken}");

        var lambda = Expression.Lambda<Func<Dictionary<string, object>, bool>>(expr, _parameters);
        var compiled = lambda.Compile();

        return new RuleEvaluator(rule, compiled);
    }

    public static RuleEvaluator Parse(string rule)
    {
        var engine = new RulesEngine(rule);
        return engine.Parse();
    }

    private Expression ParseOr()
    {
        var left = ParseAnd();
        while (!IsEnd && CurrentToken == "or")
        {
            _current++;
            var right = ParseAnd();
            left = Expression.OrElse(left, right);
        }
        return left;
    }

    private Expression ParseAnd()
    {
        var left = ParseCondition();
        while (!IsEnd && CurrentToken == "and")
        {
            _current++;
            var right = ParseCondition();
            left = Expression.AndAlso(left, right);
        }
        return left;
    }

    private Expression ParseCondition() // xxx op val
    {
        var leftToken = CurrentToken;
        _current++;
        var op = CurrentToken;
        _current++;
        var rightToken = CurrentToken;
        _current++;

        // assume right is always value
        Type expectedType = null;
        
        if (Double.TryParse(rightToken, out _))
        {
            expectedType = typeof(double);
        } 
        else if (TimeSpan.TryParse(rightToken, out _))
        {
            expectedType = typeof(TimeSpan);
        }
        else if (bool.TryParse(rightToken, out _))
        {
            expectedType = typeof(bool);
        }
        else if (rightToken.StartsWith('"') || rightToken.StartsWith('"'))
        {
            expectedType = typeof(string);
        }
        else
        {
            expectedType = typeof(object);
        }

        var left = ParseValue(leftToken, expectedType);
        var right = ParseValue(rightToken); 
        

        return op switch
        {
            ">" => Expression.GreaterThan(left, right),
            "<" => Expression.LessThan(left, right),
            "==" => Expression.Equal(left, right),
            "!=" => Expression.NotEqual(left, right),
            ">=" => Expression.GreaterThanOrEqual(left, right),
            "<=" => Expression.LessThanOrEqual(left, right),
            _ => throw new Exception($"Unknown operator: {op}")
        };
    }

    private Expression ParseValue(string? token = null, Type? expectedType = null)
    {
        token = token ?? CurrentToken;
        
        if (Double.TryParse(token, out var dbl))
            return Expression.Constant(dbl);

        if (TimeSpan.TryParse(token, out var ts))
            return Expression.Constant(ts);

        if (bool.TryParse(token, out var boolean))
            return Expression.Constant(boolean);

        if (token.StartsWith('"') || token.StartsWith('"'))
            return Expression.Constant(token.Trim('"'));

        var key = Expression.Constant(token);
        var indexer = Expression.Property(_parameters, "Item", key);
        return Expression.Convert(indexer, expectedType ?? typeof(object));
    }
}