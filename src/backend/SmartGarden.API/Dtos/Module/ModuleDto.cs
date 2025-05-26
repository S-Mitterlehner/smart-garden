using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Models;

namespace SmartGarden.API.Dtos.Module;

public class ModuleDto : ModuleRefDto
{
    public string Description { get; set; }
    public ModuleStateDto State { get; set; }
}