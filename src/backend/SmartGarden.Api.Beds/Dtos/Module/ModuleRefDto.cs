using System.Linq.Expressions;
using SmartGarden.Api.Core.Dtos;
using SmartGarden.EntityFramework.Beds.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Api.Beds.Dtos.Module;

public class ModuleRefDto : BaseDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Key { get; set; }

    public ModuleGroup Group => Type.GetModuleTypeGroup();
    public ModuleType Type { get; set; }
    
    public bool IsSensor => Type.IsSensor();
    public bool IsActuator => Type.IsActuator();

    public static Expression<Func<ModuleRef, ModuleRefDto>> FromEntity => moduleRef => new ModuleRefDto
    {
        Id = moduleRef.Id,
        Name = moduleRef.Name,
        Description = moduleRef.Description,
        Key = moduleRef.ModuleKey,
        Type = moduleRef.Type,
    };
}