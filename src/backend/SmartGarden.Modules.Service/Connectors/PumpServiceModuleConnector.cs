using MQTTnet;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Service.Connectors;

public static class PumpModuleConnectorActions
{
    public const string Start = "pump.start";
    public const string Stop = "pump.stop";
    public const string RunFor = "pump.run";
}

public static class PumpModuleConnectorStates
{
    public const string Running = "Running";
    public const string Stopped = "Stopped";
}

public class PumpServiceModuleConnector(string key, string topic, IMqttClient mqttClient, IModuleListener listener) : BaseActuatorServiceModuleConnector(key, topic, mqttClient, listener)
{
    public override ModuleType Type => ModuleType.Pump;

    protected override ModuleState GetInitialState() => new ModuleState
    {
        ConnectionState = ConnectionState.NotConnected,
        ModuleType = Type,
        StateType = StateType.Discrete,
        ModuleKey = Key,
        State = PumpModuleConnectorStates.Stopped
    };
}