using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Models;

public class ActionExecution
{
    public string ModuleKey { get; set; }
    public ModuleType ModuleType { get; set; }
    public string ActionKey { get; set; }
    public ActionType Type { get; set; }
    public double? Value { get; set; }
}
