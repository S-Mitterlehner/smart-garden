using MQTTnet;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using ConnectionState = SmartGarden.Modules.Enums.ConnectionState;

namespace SmartGarden.Modules.Service.Connectors;

public class TemperatureServiceModuleConnector(string key, string topic, IMqttClient mqtt, IModuleListener listener) : BaseSensorServiceModuleConnector(key, topic, mqtt, listener)
{
    public override ModuleType Type => ModuleType.Temperature;

    protected override ModuleState GetInitialState() => new()
    {
        ModuleKey = Key,
        ModuleType = Type,
        ConnectionState = ConnectionState.NotConnected,
        CurrentValue = 0,
        Min = 0,
        Max = 100,
        Unit = "°C"
    };
}