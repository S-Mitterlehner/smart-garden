using System.Linq.Expressions;

namespace SmartGarden.Automation.RulesEngine;

public class RulesEngine(string rule)
{
    private readonly ParameterExpression _parameters = Expression.Parameter(typeof(Dictionary<string, object>), "parameters");
    private readonly string[] _tokens = rule.Split(' ');
    private int _current = 0;

    private string CurrentToken => _tokens[_current];

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
        while (CurrentToken == "or")
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
        while (CurrentToken == "and")
        {
            _current++;
            var right = ParseCondition();
            left = Expression.AndAlso(left, right);
        }
        return left;
    }

    private Expression ParseCondition() // xxx op val
    {
        var left = ParseValue();
        _current++;
        var op = CurrentToken;
        _current++;
        var right = ParseValue();

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

    private Expression ParseValue()
    {
        if (Double.TryParse(CurrentToken, out var dbl))
            return Expression.Constant(dbl);

        if (bool.TryParse(CurrentToken, out var boolean))
            return Expression.Constant(boolean);

        if (CurrentToken.StartsWith("\"") || CurrentToken.StartsWith("\""))
            return Expression.Constant(CurrentToken.Trim('"'));

        var key = Expression.Constant(CurrentToken);
        var indexer = Expression.Property(_parameters, "Item", key);
        return Expression.Convert(indexer, typeof(object));
    }
}