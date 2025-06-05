using System.Linq.Expressions;
using SmartGarden.EntityFramework.Plants.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Api.Plants.Dtos;

public class PlantModuleConfigDto
{
    public ModuleType ModuleType { get; set; }
    public double RangeFrom { get; set; }
    public double RangeTo { get; set; }

    public static Expression<Func<PlantModuleConfig, PlantModuleConfigDto>> FromEntity => c => new PlantModuleConfigDto
    {
        RangeFrom = c.RangeFrom,
        RangeTo = c.RangeTo,
        ModuleType = c.ModuleType
    };
}