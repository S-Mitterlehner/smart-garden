using SmartGarden.EntityFramework.Core.Seeding;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework.Seeding;

public class ApiSeedModel
{
    [SeedOrder(1)]
    public List<PlantSensorConfig> PlantSensorConfigs { get; set; } = [];

    [SeedOrder(2)]
    public List<Plant> Plants { get; set; } = [];

    [SeedOrder(3)]
    public List<ModuleRef> Modules { get; set; } = [];

    [SeedOrder(4)]
    public List<Bed> Beds { get; set; } = [];
    
    [SeedOrder(5)]
    public List<AutomationRule> AutomationRules { get; set; } = [];
}