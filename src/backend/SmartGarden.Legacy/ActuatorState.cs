using SmartGarden.Modules.Actuators.Enums;
using SmartGarden.Modules.Enums;
using ConnectionState = SmartGarden.Modules.Enums.ConnectionState;

namespace SmartGarden.Modules.Actuators.Models;

[Obsolete("Please change implementation accordingly")]
public class ActuatorState
{
    public string ActuatorKey { get; set; }
    public ModuleType ActuatorType { get; set; }
    public ConnectionState ConnectionState { get; set; }
    public StateType StateType { get; init; }

    public string? State { get; set; }
    public double? CurrentValue { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public DateTime LastUpdate { get; set; } = DateTime.UtcNow;
}