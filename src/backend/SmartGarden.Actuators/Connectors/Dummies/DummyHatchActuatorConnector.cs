using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators.Connectors.Dummies;

public class DummyHatchActuatorConnector(string key) : IActuatorConnector
{
    private double value = 30;

    public string Key => key;
    public string Name => "Hatch";
    public string Description => "Hatch actuator for opening and closing hatches.";

    public async Task<IEnumerable<ActionDefinition>> GetActionsAsync()
    {
        var state = await GetStateAsync();
        return
        [
            new ActionDefinition
            {
                Name = "Open"
                , ActionType = ActionType.Value
                , Description = "Open the hatch to a certain value"
                , Key = HatchActuatorConnectorActions.Open
                , IsAllowed = true
                , CurrentValue = ((ContinuousActuatorState)state).CurrentValue
                , Min = ((ContinuousActuatorState)state).MinValue
                , Max = ((ContinuousActuatorState)state).MaxValue
            }
        ];
    }

    public async Task<ActuatorState> GetStateAsync() =>
        new ContinuousActuatorState
        {
            ConnectionState = ConnectionState.Connected,
            ActuatorKey = key,
            CurrentValue = value,
            MinValue = 0,
            MaxValue = 30,
            Unit = "°"
        };

    public Task ExecuteAsync(ActionExecution execution)
    {
        if (execution is not ValueActionExecution ex)
            throw new ArgumentException($"Execution must be of type {nameof(ValueActionExecution)}");

        if (execution.Key == HatchActuatorConnectorActions.Open)
        {
            value = Math.Clamp(ex.Value, 0, 30);
        }

        return Task.CompletedTask;
    }
}