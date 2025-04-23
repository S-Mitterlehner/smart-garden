using MQTTnet;
using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Models;

namespace SmartGarden.Sensors.Connectors;

public class HumiditySensorConnector(string key, ISensorListener listener, IMqttClient mqttClient)
    : BaseSensorConnector(key, listener, mqttClient)
{
    protected override SensorData InitialData => new SensorData
    {
        SensorKey = Key,
        SensorType = Type.ToString(),
        ConnectionState = ConnectionState.NotConnected,
        CurrentValue = 0,
        Min = 0,
        Max = 100,
        Unit = "%"
    };

    public override SensorType Type => SensorType.Humidity;
    public override string Topic => $"smart-garden/{Key}/humidity";
    public override string Name => "Humidity";
    public override string Description => "Humidity sensor is a device that measures the humidity of the environment. It is often used in weather stations.";

}