using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators.Connectors.Dummies;

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

public class DummyPumpActuatorConnector(string key) : IActuatorConnector
{
    private string _state = PumpActuatorConnectorStates.Stopped;

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
                Key = PumpActuatorConnectorActions.Start,
                IsAllowed = state.ConnectionState == ConnectionState.Connected && ds.State == PumpActuatorConnectorStates.Stopped,
                Icon = ActionIcons.Play
            },
            new ActionDefinition
            {
                Name = "Stop",
                Description = "Stop the water pump",
                ActionType = ActionType.Command,
                Key = PumpActuatorConnectorActions.Stop,
                IsAllowed = state.ConnectionState == ConnectionState.Connected && ds.State == PumpActuatorConnectorStates.Running,
                Icon = ActionIcons.Stop
            }
        ];
    }


    public async Task<ActuatorState> GetStateAsync() =>
        new DiscreteActuatorState
        {
            ConnectionState = ConnectionState.Connected,
            ActuatorKey = Key,
            State = _state
        };

    public async Task ExecuteAsync(ActionExecution execution)
    {
        if (execution is not CommandActionExecution c)
            throw new ArgumentException($"Execution must be of type {nameof(CommandActionExecution)}");

        _state = c.Key switch
        {
            PumpActuatorConnectorActions.Start => _state = PumpActuatorConnectorStates.Running,
            PumpActuatorConnectorActions.Stop => _state = PumpActuatorConnectorStates.Stopped,
            _ => throw new ArgumentException($"Unknown action key: {c.Key}")
        };
    }
}