using SmartGarden.Actuators;
using SmartGarden.Actuators.Connectors;
using SmartGarden.Actuators.Connectors.Dummies;
using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;
using SmartGarden.Core.Enums;

public class DummyHatchActuatorConnector(string key, string topic, IActuatorListener listener) : DummyBaseActuatorConnector(key, topic, listener)
{
    public override ActuatorType Type => ActuatorType.Hatch;
    public override string Name => "Dummy Hatch";
    public override string Description => "Dummy hatch actuator for testing purposes";

    protected override ActuatorState InitialState =>
        new ActuatorState
        {
            ConnectionState = ConnectionState.NotConnected
            , ActuatorType = Type
            , StateType = StateType.Continuous
            , ActuatorKey = Key
            , Unit = "%"
            , CurrentValue = 0
            , Min = 0
            , Max = 100
        };

    public override async Task<IEnumerable<ActionDefinition>> GetActionsAsync()
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
                , CurrentValue = state.CurrentValue
                , Min = state.Min
                , Max = state.Max
            }
        ];
    }

    protected override ActuatorState GetStateAfterExecution(ActionExecution execution) => new()
        {
            StateType = StateType.Continuous
            , Unit = "%"
            , ActuatorKey = Key
            , ConnectionState = ConnectionState.Connected
            , CurrentValue = execution.Value
            , Max = 100
            , Min = 0
            , LastUpdate = DateTime.UtcNow
            , ActuatorType = Type
        };
}