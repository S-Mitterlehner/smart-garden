using SmartGarden.Modules.Actuators.Enums;

namespace SmartGarden.Modules.Actuators.Models;

[Obsolete("Please change implementation accordingly")]
public class ActionExecution
{
    public string Key { get; set; }
    public ActionType Type { get; set; }
    public double? Value { get; set; }
}
