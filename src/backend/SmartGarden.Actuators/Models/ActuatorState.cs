using System.Data;
using SmartGarden.Actuators.Enums;
using ConnectionState = SmartGarden.Actuators.Enums.ConnectionState;

namespace SmartGarden.Actuators.Models;

public abstract class ActuatorState(StateType type)
{
    public string ActuatorKey { get; set; }
    public ConnectionState ConnectionState { get; set; }
    public StateType Type { get; } = type;
}

public class DiscreteActuatorState() : ActuatorState(StateType.Discrete)
{
    public string State { get; set; }
}

public class ContinuousActuatorState() : ActuatorState(StateType.Continuous)
{
    public double CurrentValue { get; set; }
    public double? MinValue { get; set; }
    public double? MaxValue { get; set; }
    public string Unit { get; set; }
}