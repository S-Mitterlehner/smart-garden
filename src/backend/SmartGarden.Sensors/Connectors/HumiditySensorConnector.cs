using MQTTnet;
using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Models;
using ConnectionState = SmartGarden.Core.Enums.ConnectionState;

namespace SmartGarden.Sensors.Connectors;

public class HumiditySensorConnector(string key, string topic, ISensorListener listener, IMqttClient mqttClient)
    : BaseSensorConnector(key, topic, listener, mqttClient)
{
    public override SensorType Type => SensorType.Humidity;
    public override string Name => "Humidity";
    public override string Description => "Humidity sensor is a device that measures the humidity of the environment. It is often used in weather stations.";

    protected override SensorData InitialData => new SensorData
    {
        SensorKey = Key,
        SensorType = Type,
        ConnectionState = ConnectionState.NotConnected,
        CurrentValue = 0,
        Min = 0,
        Max = 100,
        Unit = "%"
    };
}