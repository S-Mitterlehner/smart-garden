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

    public double? Min { get; internal init; }
    public double? Max { get; internal init; }
    public ActionIcons Icon { get; set; } = ActionIcons.Play;
}