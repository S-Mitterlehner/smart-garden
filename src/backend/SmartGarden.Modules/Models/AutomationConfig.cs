using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Models;

public class AutomationConfig
{
    public virtual string Group { get; init; }
    public virtual string Key { get; init; }

    public virtual string Label { get; init; }
    
    public StateType ValueType { get; set; }

    /// <summary>
    /// Typescript type of the field.
    /// </summary>
    public string TsType { get; set; }

    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }

    public List<DiscreteValue>? Values { get; set; }
}

public class ModuleAutomationConfig : AutomationConfig
{
    public string ModuleKey { get; set; }
    public ModuleType ModuleType { get; set; }

    public override string Group => ModuleKey.Replace("-", "_");
    public override string Key => $"{Group}.{ModuleType.ToString().ToUpper()}";
    public override string Label => ModuleType.ToString();
}

public class DiscreteValue
{
    public string Label { get; set; }
    public string Value { get; set; }  
}