using System.Linq.Expressions;
using SmartGarden.Actuators.Models;

namespace SmartGarden.API.Dtos.Actuator;

public class ActuatorActionDto 
{
    public string Key { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Type { get; set; }
    public bool IsAllowed { get; set; }
    public string Icon { get; set; }

    public double? CurrentValue { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }

    public static Expression<Func<ActionDefinition, ActuatorActionDto>> FromEntity => ca => new ActuatorActionDto
    {
        Icon = ca.Icon.ToString().ToLower(),
        Key = ca.Key,
        Name = ca.Name,
        Description = ca.Description,
        Type = ca.ActionType.ToString(),
        CurrentValue = ca.CurrentValue,
        Min = ca.Min,
        Max = ca.Max,
        IsAllowed = ca.IsAllowed
    };
}