using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.Dtos.Actuator;

public class ActuatorRefDto : BaseDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Key { get; set; }
    public ModuleType Type { get; set; }

    public static Expression<Func<ModuleRef, ActuatorRefDto>> FromEntity => s => new ActuatorRefDto
    {
        Id = s.Id,
        Name = s.Name,
        Description = s.Description,
        Key = s.ModuleKey,
        Type = s.Type
    };
}