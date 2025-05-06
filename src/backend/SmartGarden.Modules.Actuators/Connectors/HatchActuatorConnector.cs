
using MQTTnet;
using SmartGarden.Modules.Actuators.Enums;
using SmartGarden.Modules.Actuators.Models;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Actuators.Connectors;

public static class HatchActuatorConnectorActions
{
    public const string Open = "hatch.open";
    public const string Close = "hatch.close";
    public const string Set = "hatch.set";
}

public class HatchActuatorConnector(string key, string topic, IMqttClient mqttClient, IActuatorListener listener)
    : BaseActuatorConnector(key, topic, mqttClient, listener)
{
    public override ActuatorType Type => ActuatorType.Hatch;
    public override string Name => "Hatch";
    public override string Description => "Hatch actuator for opening and closing hatches.";
    
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
        
        return [
            new ActionDefinition
            {
                Name = "Open"
                , ActionType = ActionType.Command
                , Description = "Open the hatch"
                , Key = HatchActuatorConnectorActions.Open
                , IsAllowed = true
            },
            new ActionDefinition
            {
                Name = "Close"
                , ActionType = ActionType.Command
                , Description = "Close the hatch"
                , Key = HatchActuatorConnectorActions.Close
                , IsAllowed = true
            },
            new ActionDefinition
            {
                Name = "Set"
                , ActionType = ActionType.Value
                , Description = "Set the hatch to a certain value"
                , Key = HatchActuatorConnectorActions.Set
                , IsAllowed = true
                , CurrentValue = state.CurrentValue
                , Min = 0
                , Max = 100
                , Unit = "%"
            }
        ];
    }

    public override async Task<ModuleAutomationConfig> GetAutomationConfigAsync()
    {
        return new ModuleAutomationConfig<ActuatorType>
        {
            // TODO ???
        };
    }
}