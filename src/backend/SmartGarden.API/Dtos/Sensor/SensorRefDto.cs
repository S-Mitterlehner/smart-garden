using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.Dtos.Sensor;

public class SensorRefDto : BaseDto
{
    public ModuleType Type { get; set; } 
    public string Name { get; set; }
    public string Description { get; set; }
    public string? Key { get; set; }
    
    public static Expression<Func<ModuleRef, SensorRefDto>> FromEntity => s => new SensorRefDto
    {
        Id = s.Id,
        Name = s.Name,
        Description = s.Description,
        Type = s.Type,
        Key = s.ModuleKey
    };
}