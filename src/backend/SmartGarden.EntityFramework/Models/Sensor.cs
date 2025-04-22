using SmartGarden.EntityFramework.Enums;

namespace SmartGarden.EntityFramework.Models;

public class Sensor : BaseEntityWithOrder
{
    public string Name { get; set; }
    public string Description { get; set; }
    public double Min { get; set; }
    public double Max { get; set; }
    public string Unit { get; set; }
    public SensorType Type { get; set; }

    // TODO: Add Properties to connect actual Sensor to app
}