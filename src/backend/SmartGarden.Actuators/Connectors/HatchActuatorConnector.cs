using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators.Connectors;
public static class HatchActuatorConnectorActions
{
    public const string Open = "hatch.open";
}

public class HatchActuatorConnector(string key) : IActuatorConnector
{
    public string Key => key;
    public string Name => "Hatch";
    public string Description => "Hatch actuator for opening and closing hatches.";

    public async Task<IEnumerable<ActionDefinition>> GetActionsAsync() =>
    [
        new ActionDefinition
        {
            Name = "Open"
            , ActionType = ActionType.Value
            , Description = "Open the hatch to a certain value"
            , Key = "hatch.open"
            , IsAllowed = true
            , Min = 0
            , Max = 30
        }
    ];

    public async Task<ActuatorState> GetStateAsync() =>
        // TODO: Ask actual actuator or take from listener
        new ContinuousActuatorState
        {
            ConnectionState = ConnectionState.Connected,
            ActuatorKey = key,
            CurrentValue = 15,
            MinValue = 0,
            MaxValue = 30,
            Unit = "°"
        };

    public Task ExecuteAsync(ActionExecution execution)
    {
        // TODO: Call actual actuator
        return Task.CompletedTask;
    }
}