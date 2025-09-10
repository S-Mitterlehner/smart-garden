using SmartGarden.EntityFramework.Core.Models;

namespace SmartGarden.EntityFramework.Models;

public class Plant : BaseEntityWithOrder
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public virtual List<PlantModuleConfig> ModuleConfigs { get; set; } = new();
}