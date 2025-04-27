using SmartGarden.Modules.Actuators.Enums;

namespace SmartGarden.Modules.Actuators.Models;

public class ActionExecution
{
    public string Key { get; set; }
    public ActionType Type { get; set; }
    public double? Value { get; set; }
}
