using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Models;

public class ModuleAutomationConfig
{
    public string ConnectorKey { get; set; }
    public ModuleType ModuleType { get; set; }
    public string Type => ModuleType.ToString();

    /// <summary>
    /// Typescript type of the field.
    /// </summary>
    public string TsType { get; set; }

    public double? Min { get; set; }

    public double? Max { get; set; }
    public string? Unit { get; set; }

    public List<DiscreteValue>? Values { get; set; }
}

public class DiscreteValue
{
    public string Label { get; set; }
    public string Value { get; set; }  
}