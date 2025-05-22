using SmartGarden.EntityFramework.Core.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.EntityFramework.Models;

public class PlantSensorConfig : BaseEntity
{
    public ModuleType ModuleType { get; set; }
    public double RangeFrom { get; set; }
    public double RangeTo { get; set; }
}