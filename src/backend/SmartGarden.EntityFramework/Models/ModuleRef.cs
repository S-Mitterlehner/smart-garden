using System.ComponentModel.DataAnnotations.Schema;
using SmartGarden.EntityFramework.Core.Models;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.EntityFramework.Models;

public class ModuleRef : BaseEntityWithOrder, IModuleRef
{
    public string Name { get; set; }
    public string? Description { get; set; }
    public ModuleType Type { get; set; }
    public string? ModuleKey { get; set; }
}