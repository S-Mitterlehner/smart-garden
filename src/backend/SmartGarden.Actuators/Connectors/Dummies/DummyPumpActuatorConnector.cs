using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators.Connectors.Dummies;

public class DummyPumpActuatorConnector(string key, string topic, IActuatorListener listener) : DummyBaseActuatorConnector(key, topic, listener)
{
    public override ActuatorType Type => ActuatorType.Pump;
    public override string Name => "Dummy Pump";
    public override string Description => "Just a dummy pump for testing.";
    protected override ActuatorState InitialState => new ActuatorState
    {
        ConnectionState = ConnectionState.NotConnected, 
        ActuatorType = Type, 
        StateType = StateType.Discrete, 
        ActuatorKey = Key, 
        State = PumpActuatorConnectorStates.Stopped
    };

    public override async Task<IEnumerable<ActionDefinition>> GetActionsAsync()
    {
        var state = await GetStateAsync();

        return [
            new ActionDefinition
            {
                Name = "Start",
                Description = "Start the water pump",
                ActionType = ActionType.Command,
                Key = PumpActuatorConnectorActions.Start,
                IsAllowed = state is { ConnectionState: ConnectionState.Connected, State: PumpActuatorConnectorStates.Stopped },
                Icon = ActionIcons.Play
            },
            new ActionDefinition
            {
                Name = "Stop",
                Description = "Stop the water pump",
                ActionType = ActionType.Command,
                Key =  PumpActuatorConnectorActions.Stop,
                IsAllowed = state is { ConnectionState: ConnectionState.Connected, State: PumpActuatorConnectorStates.Running },
                Icon = ActionIcons.Stop
            }
        ];
    }

    protected override ActuatorState GetStateAfterExecution(ActionExecution execution) => execution.Key switch
        {
            PumpActuatorConnectorActions.Start => new ActuatorState
            {
                ConnectionState = ConnectionState.Connected
                , ActuatorType = Type
                , StateType = StateType.Discrete
                , ActuatorKey = Key
                , State = PumpActuatorConnectorStates.Running
            }
            , PumpActuatorConnectorActions.Stop => new ActuatorState
            {
                ConnectionState = ConnectionState.Connected
                , ActuatorType = Type
                , StateType = StateType.Discrete
                , ActuatorKey = Key
                , State = PumpActuatorConnectorStates.Stopped
            }
            , _ => throw new ArgumentOutOfRangeException(nameof(execution), "Action not found for this Actuator")
        };
}