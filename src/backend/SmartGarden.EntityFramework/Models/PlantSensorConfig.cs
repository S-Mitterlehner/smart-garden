using SmartGarden.Modules.Enums;

namespace SmartGarden.EntityFramework.Models;

public class PlantSensorConfig : BaseEntity
{
    public SensorType SensorType { get; set; }
    public double RangeFrom { get; set; }
    public double RangeTo { get; set; }
}