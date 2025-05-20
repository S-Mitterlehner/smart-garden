using MQTTnet;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Service.Connectors;

public class MoistureServiceModuleConnector(string key, string topic, IMqttClient mqtt, IModuleListener listener) : BaseSensorServiceModuleConnector(key, topic, mqtt, listener)
{
    public override ModuleType Type => ModuleType.Moisture;
    protected override ModuleState GetInitialState() => new ModuleState()
    {
        ModuleKey = Key,
        ModuleType = Type,
        ConnectionState = ConnectionState.NotConnected,
        CurrentValue = 0,
        Min = 0,
        Max = 100,
        Unit = "%"
    };
}
