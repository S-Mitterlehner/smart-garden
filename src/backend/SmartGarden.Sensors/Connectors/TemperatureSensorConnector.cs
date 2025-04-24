using MQTTnet;
using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Models;
using ConnectionState = SmartGarden.Core.Enums.ConnectionState;

namespace SmartGarden.Sensors.Connectors;

public class TemperatureSensorConnector(string key, string topic, ISensorListener listener, IMqttClient mqttClient)
    : BaseSensorConnector(key, topic, listener, mqttClient)
{
    public override SensorType Type => SensorType.Temperature;
    public override string Name => "Temperature";
    public override string Description => "Temperature sensor is a device that measures the temperature of the environment. It is often used in weather stations.";
    protected override SensorData InitialData => new()
    {
        SensorKey = Key,
        SensorType = Type.ToString(),
        ConnectionState = ConnectionState.NotConnected,
        CurrentValue = 0,
        Min = 0,
        Max = 100,
        Unit = "°C"
    };
}