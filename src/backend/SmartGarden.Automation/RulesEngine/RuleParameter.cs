namespace SmartGarden.Automation.RulesEngine;

public class RuleParameter
{
    public RuleParameter(string name, object value)
    {
        Name = name;
        Value = value;
    }

    public string Name { get; }
    public object Value { get; set; }
}