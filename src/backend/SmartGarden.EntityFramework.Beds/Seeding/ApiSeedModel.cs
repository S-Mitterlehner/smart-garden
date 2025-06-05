using SmartGarden.EntityFramework.Beds.Models;
using SmartGarden.EntityFramework.Core.Seeding;

namespace SmartGarden.EntityFramework.Beds.Seeding;

public class ApiSeedModel
{
    [SeedOrder(1)]
    public List<PlantModuleConfig> PlantModuleConfigs { get; set; } = [];

    [SeedOrder(2)]
    public List<Plant> Plants { get; set; } = [];

    [SeedOrder(3)]
    public List<ModuleRef> Modules { get; set; } = [];

    [SeedOrder(4)]
    public List<Bed> Beds { get; set; } = [];
    
    [SeedOrder(5)]
    public List<AutomationRule> AutomationRules { get; set; } = [];
}