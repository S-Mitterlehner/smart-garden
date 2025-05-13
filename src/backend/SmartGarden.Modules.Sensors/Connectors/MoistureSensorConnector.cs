using Microsoft.Extensions.Logging;
using MQTTnet;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.Modules.Sensors.Connectors;

public class MoistureSensorConnector(string key, string topic, ISensorListener listener, IMqttClient mqttClient, ILogger<MoistureSensorConnector> logger)
    : BaseSensorConnector(key, topic, listener, mqttClient, logger)
{
    public override SensorType Type => SensorType.Moisture;
    public override string Name => "Moisture";
    public override string Description 
        => """
           Soil moisture sensor is a device that measures the water content in the soil.
           It is commonly used in gardening to monitor soil conditions.
           """;

    protected override SensorData InitialData => new SensorData()
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
