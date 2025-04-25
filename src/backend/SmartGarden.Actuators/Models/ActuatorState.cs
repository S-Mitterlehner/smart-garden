using SmartGarden.Actuators.Enums;
using SmartGarden.Core.Enums;
using ConnectionState = SmartGarden.Core.Enums.ConnectionState;

namespace SmartGarden.Actuators.Models;

public class ActuatorState
{
    public string ActuatorKey { get; set; }
    public ActuatorType ActuatorType { get; set; }
    public ConnectionState ConnectionState { get; set; }
    public StateType StateType { get; init; }

    public string? State { get; set; }
    public double? CurrentValue { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string Unit { get; set; }
    public DateTime LastUpdate { get; set; }
}