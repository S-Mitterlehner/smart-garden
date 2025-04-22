using SmartGarden.Actuators.Models;

namespace SmartGarden.API.Dtos.Actuator;

public class ActuatorStateDto
{
    public string ConnectionState { get; set; }
    public string Type { get; set; }
    public string? State { get; set; }
    public double? Value { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }

    public static ActuatorStateDto FromState(ActuatorState state)
    {
        return state switch
        {
            DiscreteActuatorState ds => new ActuatorStateDto
            {
                ConnectionState = ds.ConnectionState.ToString().ToUpper()
                , State = ds.State
                , Type = ds.Type.ToString()
            }
            , ContinuousActuatorState cs => new ActuatorStateDto
            {
                ConnectionState = cs.ConnectionState.ToString().ToUpper()
                , Type = cs.Type.ToString()
                , Value = cs.CurrentValue
                , Min = cs.MinValue
                , Max = cs.MaxValue
                , Unit = cs.Unit
            }
            , _ => throw new ArgumentException("Invalid actuator state type", nameof(state))
        };
    }
}