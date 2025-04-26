using SmartGarden.Actuators.Enums;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators.Models;

public class ActionDefinition
{
    public string Key { get; internal init; }
    public string Name { get; internal init; }
    public string Description { get; internal init; }
    public ActionType ActionType { get; internal init; }
    public bool IsAllowed { get; set; }

    public ActionIcons Icon { get; internal init; } = ActionIcons.Play;
    
    public double? CurrentValue { get; internal init; }
    public double? Min { get; internal init; }
    public double? Max { get; internal init; }
    public double? Increment { get; set; }
    public string? Unit { get; internal init; }
}