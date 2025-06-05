using System.Linq.Expressions;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Api.Beds.Dtos.Automation;

public class AutomationConfigDto
{
    public List<ParameterGroupDto> Parameters { get; set; }
}

public class ParameterGroupDto
{
    public string Label { get; set; }
    public string Key { get; set; }

    public List<ParameterFieldDto> Fields { get; set; }
}

public class ParameterFieldDto
{    
    public string Key { get; set; }

    public string Label { get; set; }

    public virtual StateType ValueType { get; set; }
    public string? TsType { get; set; }

    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }

    public List<AutomationSelectValueDto> Values { get; set; } = [];

    public static Expression<Func<AutomationConfig, ParameterFieldDto>> FromModel =>
        c => new ParameterFieldDto
        {
            Key = c.Key
            , Label = c.Label
            , ValueType = c.ValueType
            , TsType = c.TsType
            , Min = c.Min
            , Max = c.Max
            , Unit = c.Unit
            , Values = c.Values != null ? c.Values.Select(v => new AutomationSelectValueDto {Label = v.Label, Value = v.Value}).ToList() : new()
        };
}

public class AutomationSelectValueDto
{
    public string Label { get; set; }
    public string Value { get; set; }
}