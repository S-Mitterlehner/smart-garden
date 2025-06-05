using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Api.Beds.Dtos.Actuator;

public class ActuatorStateDto
{
    public string ActuatorKey { get; set; }
    public ModuleType ActuatorType { get; set; }
    public ConnectionState ConnectionState { get; set; }
    public StateType StateType { get; set; }
    public string? State { get; set; }
    public double? Value { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public DateTime LastUpdate { get; set; }

    public IEnumerable<ActuatorActionDto> Actions { get; set; }

    public static ActuatorStateDto FromState(ModuleState state, IEnumerable<ActionDefinition> actions) => new()
        {
            ActuatorKey = state.ModuleKey
            , ActuatorType = state.ModuleType
            , ConnectionState = state.ConnectionState
            , StateType = state.StateType
            , State = state.State
            , Value = state.CurrentValue
            , Min = state.Min
            , Max = state.Max
            , Unit = state.Unit
            , LastUpdate = DateTime.UtcNow
            , Actions = actions.AsQueryable().Select(ActuatorActionDto.FromEntity).ToList()
    };
}