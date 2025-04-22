using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators.Connectors;

public class PumpActuatorConnector(string key) : IActuatorConnector
{
    public const string STATE_RUNNING = "RUNNING";
    public const string STATE_STOPPED = "STOPPED";

    public string Key => key;
    public string Name => "Water Pump";
    public string Description => "Water Pump for irrigation";

    public async Task<IEnumerable<ActionDefinition>> GetActionsAsync()
    {
        var state = await GetStateAsync();

        if(state is not DiscreteActuatorState ds)
            throw new InvalidOperationException("State is not a DiscreteActuatorState");

        return [
            new ActionDefinition
            {
                Name = "Start",
                Description = "Start the water pump",
                ActionType = ActionType.Command,
                Key = "pump.start",
                IsAllowed = state.ConnectionState == ConnectionState.Connected && ds.State == STATE_STOPPED,
                Icon = ActionIcons.Play
            },
            new ActionDefinition
            {
                Name = "Stop",
                Description = "Stop the water pump",
                ActionType = ActionType.Command,
                Key = "pump.stop",
                IsAllowed = state.ConnectionState == ConnectionState.Connected && ds.State == STATE_RUNNING,
                Icon = ActionIcons.Stop
            }
        ];
    }


    public async Task<ActuatorState> GetStateAsync()
    {
        // TODO: Ask actual actuator or take from listener
        return new DiscreteActuatorState
        {
            ConnectionState = ConnectionState.Connected,
            ActuatorKey = Key,
            State = STATE_STOPPED
        };
    }

    public Task ExecuteAsync(ActionExecution execution)
    {
        // TODO: Call actual actuator
        return Task.CompletedTask;
    }
}