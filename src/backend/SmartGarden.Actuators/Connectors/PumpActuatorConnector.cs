using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators.Connectors;

public static class PumpActuatorConnectorActions
{
    public const string Start = "pump.start";
    public const string Stop = "pump.stop";
}

public static class PumpActuatorConnectorStates
{
    public const string Running = "RUNNING";
    public const string Stopped = "STOPPED";
}

public class PumpActuatorConnector(string key) : IActuatorConnector
{
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
                IsAllowed = state.ConnectionState == ConnectionState.Connected && ds.State == PumpActuatorConnectorStates.Stopped,
                Icon = ActionIcons.Play
            },
            new ActionDefinition
            {
                Name = "Stop",
                Description = "Stop the water pump",
                ActionType = ActionType.Command,
                Key = "pump.stop",
                IsAllowed = state.ConnectionState == ConnectionState.Connected && ds.State == PumpActuatorConnectorStates.Running,
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
            State = PumpActuatorConnectorStates.Stopped
        };
    }

    public Task ExecuteAsync(ActionExecution execution)
    {
        // TODO: Call actual actuator
        return Task.CompletedTask;
    }
}