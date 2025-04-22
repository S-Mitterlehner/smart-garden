using SmartGarden.Core.Enums;

namespace SmartGarden.Sensors.Models;

public class SensorData
{
    public string SensorKey { get; set; }
    public ConnectionState ConnectionState { get; set; }

    public double CurrentValue { get; set; }
    public double Min { get; set; }
    public double Max { get; set; }
    public string Unit { get; set; }
}