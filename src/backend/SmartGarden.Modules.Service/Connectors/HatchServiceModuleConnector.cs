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
}