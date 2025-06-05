using SmartGarden.EntityFramework.Core.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.EntityFramework.Beds.Models;

public class PlantModuleConfig : BaseEntity
{
    public ModuleType ModuleType { get; set; }
    public double RangeFrom { get; set; }
    public double RangeTo { get; set; }
}