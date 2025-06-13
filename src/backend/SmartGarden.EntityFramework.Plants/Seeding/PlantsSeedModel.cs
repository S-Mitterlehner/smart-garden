using SmartGarden.EntityFramework.Core.Seeding;
using SmartGarden.EntityFramework.Plants.Models;

namespace SmartGarden.EntityFramework.Plants.Seeding;

public class PlantsSeedModel
{
    [SeedOrder(1)]
    public List<PlantModuleConfig> PlantModuleConfigs { get; set; } = [];

    [SeedOrder(2)]
    public List<Plant> Plants { get; set; } = [];

}