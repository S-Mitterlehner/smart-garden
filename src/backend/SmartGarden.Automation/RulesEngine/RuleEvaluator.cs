namespace SmartGarden.Automation.RulesEngine;

public class RuleEvaluator
{
    private readonly Func<Dictionary<string, object>, bool> _evaluateFunc;
    public string Rule { get; set; }
    
    internal RuleEvaluator(string rule, Func<Dictionary<string, object>, bool> evaluateFunc)
    {
        Rule = rule;
        _evaluateFunc = evaluateFunc;
    }

    public RuleResult Evaluate(IEnumerable<RuleParameter> parameters)
    {
        try
        {
            var p = parameters.ToDictionary(x => x.Name, x => x.Value);
            var result = _evaluateFunc(p);
            return new RuleResult { Rule = Rule, IsSuccess = result };
        } catch(Exception ex)
        {
            return new RuleResult { Rule = Rule, IsSuccess = false, Message = ex.Message };
        }
    }
}