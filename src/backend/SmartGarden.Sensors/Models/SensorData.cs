using SmartGarden.Core.Enums;

namespace SmartGarden.Sensors.Models;

public class SensorData
{
    public string SensorKey { get; set; }
    public string SensorType { get; set; }
    public ConnectionState ConnectionState { get; set; }
    public double CurrentValue { get; set; }
    public double Min { get; set; }
    public double Max { get; set; }
    public string Unit { get; set; }
    public DateTime LastUpdate { get; set; }

    internal static SensorData FromMqtt(MqttSensorData? data, SensorType type) => new SensorData
    {
        SensorKey = data?.SensorKey ?? "",
        SensorType = type.ToString(),
        CurrentValue = data?.CurrentValue ?? 0,
        Min = data?.Min ?? 0,
        Max = data?.Max ?? 0,
        ConnectionState = ConnectionState.Connected,
        Unit = data?.Unit ?? "",
        LastUpdate = DateTime.UtcNow
    };
}