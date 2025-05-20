using MQTTnet;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Service.Connectors;

public static class HatchModuleConnectorActions
{
    public const string Open = "hatch.open";
    public const string Close = "hatch.close";
    public const string Set = "hatch.set";
}

public class HatchServiceModuleConnector(string key, string topic, IMqttClient mqttClient, IModuleListener listener) : BaseActuatorServiceModuleConnector(key, topic, mqttClient, listener)
{
    public override ModuleType Type => ModuleType.Hatch;
    
    protected override ModuleState GetInitialState() =>
        new ModuleState
        {
            ConnectionState = ConnectionState.NotConnected
            , ModuleType = Type
            , StateType = StateType.Continuous
            , ModuleKey = Key
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
                , ActionKey = HatchModuleConnectorActions.Open
                , IsAllowed = true
            },
            new ActionDefinition
            {
                Name = "Close"
                , ActionType = ActionType.Command
                , Description = "Close the hatch"
                , ActionKey = HatchModuleConnectorActions.Close
                , IsAllowed = true
            },
            new ActionDefinition
            {
                Name = "Set"
                , ActionType = ActionType.Value
                , Description = "Set the hatch to a certain value"
                , ActionKey = HatchModuleConnectorActions.Set
                , IsAllowed = true
                , CurrentValue = state.CurrentValue
                , Min = 0
                , Max = 100
                , Unit = "%"
            }
        ];
    }
}