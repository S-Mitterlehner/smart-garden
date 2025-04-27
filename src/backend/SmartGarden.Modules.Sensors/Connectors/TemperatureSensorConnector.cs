using MQTTnet;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Sensors.Models;
using ConnectionState = SmartGarden.Modules.Enums.ConnectionState;

namespace SmartGarden.Modules.Sensors.Connectors;

public class TemperatureSensorConnector(string key, string topic, ISensorListener listener, IMqttClient mqttClient)
    : BaseSensorConnector(key, topic, listener, mqttClient)
{
    public override SensorType Type => SensorType.Temperature;
    public override string Name => "Temperature";
    public override string Description => "Temperature sensor is a device that measures the temperature of the environment. It is often used in weather stations.";

    protected override SensorData InitialData => new()
    {
        SensorKey = Key,
        SensorType = Type,
        ConnectionState = ConnectionState.NotConnected,
        CurrentValue = 0,
        Min = 0,
        Max = 100,
        Unit = "°C"
    };
}