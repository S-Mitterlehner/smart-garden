using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.API.Dtos.Actuator;

public class ActuatorStateDto
{
    public string ActuatorKey { get; set; }
    public string ActuatorType { get; set; }
    public string ConnectionState { get; set; }
    public string StateType { get; set; }
    public string? State { get; set; }
    public double? Value { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public DateTime LastUpdate { get; set; }

    public IEnumerable<ActuatorActionDto> Actions { get; set; }

    public static ActuatorStateDto FromState(ActuatorState state, IEnumerable<ActionDefinition> actions) => new()
        {
            ActuatorKey = state.ActuatorKey
            , ActuatorType = state.ActuatorType.ToString()
            , ConnectionState = state.ConnectionState.ToString()
            , StateType = state.StateType.ToString()
            , State = state.State
            , Value = state.CurrentValue
            , Min = state.Min
            , Max = state.Max
            , Unit = state.Unit
            , LastUpdate = DateTime.UtcNow
            , Actions = actions.AsQueryable().Select(ActuatorActionDto.FromEntity).ToList()
    };
}