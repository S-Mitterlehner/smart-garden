using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Sensors.Models;

public class SensorData
{
    public string SensorKey { get; set; }
    public ModuleType SensorType { get; set; }
    public ConnectionState ConnectionState { get; set; }
    public double CurrentValue { get; set; }
    public double Min { get; set; }
    public double Max { get; set; }
    public string Unit { get; set; }
    public DateTime LastUpdate { get; set; } = DateTime.UtcNow;
}