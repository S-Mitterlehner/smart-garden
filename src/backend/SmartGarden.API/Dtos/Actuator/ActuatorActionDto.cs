using System.Linq.Expressions;
using SmartGarden.Modules.Enums;
using ActionDefinition = SmartGarden.Modules.Models.ActionDefinition;

namespace SmartGarden.API.Dtos.Actuator;

public class ActuatorActionDto 
{
    public string Key { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ActionType Type { get; set; }
    public bool IsAllowed { get; set; }
    public ActionIcons Icon { get; set; }

    public double? CurrentValue { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public double? Increment { get; set; }
    public string? Unit { get; set; }

    public static Expression<Func<ActionDefinition, ActuatorActionDto>> FromEntity => ca => new ActuatorActionDto
    {
        Icon = ca.Icon,
        Key = ca.ActionKey,
        Name = ca.Name,
        Description = ca.Description,
        Type = ca.ActionType,
        CurrentValue = ca.CurrentValue,
        Min = ca.Min,
        Max = ca.Max,
        Unit = ca.Unit,
        Increment = ca.Increment,
        IsAllowed = ca.IsAllowed
    };

    
    [Obsolete("Use FromEntity instead. This will be removed in a future version.")]
    public static Expression<Func<Modules.Actuators.Models.ActionDefinition, ActuatorActionDto>> FromEntityOld => ca => new ActuatorActionDto
    {
        Icon = ca.Icon,
        Key = ca.Key,
        Name = ca.Name,
        Description = ca.Description,
        Type = ca.ActionType,
        CurrentValue = ca.CurrentValue,
        Min = ca.Min,
        Max = ca.Max,
        Unit = ca.Unit,
        Increment = ca.Increment,
        IsAllowed = ca.IsAllowed
    };
}