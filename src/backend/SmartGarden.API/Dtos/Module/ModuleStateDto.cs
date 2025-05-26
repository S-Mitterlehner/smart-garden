using SmartGarden.API.Dtos.Actuator;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.API.Dtos.Module;

public class ModuleStateDto
{
    public string ModuleKey { get; set; }
    public ModuleType ModuleType { get; set; }
    public ConnectionState ConnectionState { get; set; }
    public StateType StateType { get; set; }
    public string? State { get; set; }
    public double? Value { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public DateTime LastUpdate { get; set; }

    public IEnumerable<ModuleActionDto> Actions { get; set; } = new List<ModuleActionDto>();
    

    public static ModuleStateDto FromState(ModuleState state, IEnumerable<ActionDefinition> actions) => new()
        {
            ModuleKey = state.ModuleKey
            , ModuleType = state.ModuleType
            , ConnectionState = state.ConnectionState
            , StateType = state.StateType
            , State = state.State
            , Value = state.CurrentValue
            , Min = state.Min
            , Max = state.Max
            , Unit = state.Unit
            , LastUpdate = DateTime.UtcNow
            , Actions = actions.AsQueryable().Select(ModuleActionDto.FromEntity).ToList()
    };
}