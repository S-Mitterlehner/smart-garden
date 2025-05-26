using SmartGarden.AutomationService.EntityFramework.Models;

namespace SmartGarden.AutomationService.EntityFramework.Seeding;

public class AutomationServiceSeedModel
{
    public List<ModuleRef> Modules { get; set; } = [];
    public List<AutomationRule> AutomationRules { get; set; } = [];
}