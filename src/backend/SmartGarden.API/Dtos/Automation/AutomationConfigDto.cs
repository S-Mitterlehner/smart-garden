using System.Linq.Expressions;
using SmartGarden.Modules.Models;

namespace SmartGarden.API.Dtos.Automation;

public class AutomationConfigDto
{
    public List<ParameterFieldDto> Fields { get; set; }
}

public class ParameterFieldDto
{
    public string ConnectorKey { get; set; }
    public virtual string Type { get; set; }
    public string TsType { get; set; }

    public double? Min { get; set; }

    public double? Max { get; set; }
    public string? Unit { get; set; }

    public List<AutomationSelectValueDto>? Values { get; set; }

    public static Expression<Func<ModuleAutomationConfig, ParameterFieldDto>> FromModel =>
        c => new ParameterFieldDto
        {
            ConnectorKey = c.ConnectorKey
            , Type = c.Type.ToString()
            , TsType = c.TsType
            , Min = c.Min
            , Max = c.Max
            , Unit = c.Unit
            , Values = c.Values != null ? c.Values.Select(v => new AutomationSelectValueDto {Label = v.Label, Value = v.Value}).ToList() : null
        };
}

public class AutomationSelectValueDto
{
    public string Label { get; set; }
    public string Value { get; set; }
}