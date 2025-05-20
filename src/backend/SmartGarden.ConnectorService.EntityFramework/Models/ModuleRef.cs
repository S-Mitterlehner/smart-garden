using SmartGarden.EntityFramework.Core.Models;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.ConnectorService.EntityFramework.Models;

public class ModuleRef : BaseEntity, IModuleRef
{
    public string ModuleKey { get; set; }
    public ModuleType Type { get; set; }
    public string Topic { get; set; }
}