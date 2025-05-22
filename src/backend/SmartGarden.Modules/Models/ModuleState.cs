using SmartGarden.Modules.Enums;
using ConnectionState = SmartGarden.Modules.Enums.ConnectionState;

namespace SmartGarden.Modules.Models;

public class ModuleState
{
    public string ModuleKey { get; set; }
    public ModuleType ModuleType { get; set; }
    public ConnectionState ConnectionState { get; set; }
    public StateType StateType { get; init; }

    public string? State { get; set; }
    public double? CurrentValue { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public DateTime LastUpdate { get; set; } = DateTime.UtcNow;
}