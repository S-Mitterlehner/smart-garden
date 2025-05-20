using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Actuators.Models;

[Obsolete("Please change implementation accordingly")]
public class ActionDefinition
{
    public string Key { get; init; }
    public string Name { get; init; }
    public string Description { get; init; }
    public SmartGarden.Modules.Actuators.Enums.ActionType ActionType { get; init; }
    public bool IsAllowed { get; set; }

    public ActionIcons Icon { get; init; } = ActionIcons.Play;
    
    public double? CurrentValue { get; init; }
    public double? Min { get; init; }
    public double? Max { get; init; }
    public double? Increment { get; set; }
    public string? Unit { get; init; }
}