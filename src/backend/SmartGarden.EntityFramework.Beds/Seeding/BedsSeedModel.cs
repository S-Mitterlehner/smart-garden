using SmartGarden.EntityFramework.Beds.Models;
using SmartGarden.EntityFramework.Core.Seeding;

namespace SmartGarden.EntityFramework.Beds.Seeding;

public class BedsSeedModel
{
    [SeedOrder(1)]
    public List<ModuleRef> Modules { get; set; } = [];

    [SeedOrder(2)]
    public List<Bed> Beds { get; set; } = [];
    
    [SeedOrder(3)]
    public List<AutomationRule> AutomationRules { get; set; } = [];
}