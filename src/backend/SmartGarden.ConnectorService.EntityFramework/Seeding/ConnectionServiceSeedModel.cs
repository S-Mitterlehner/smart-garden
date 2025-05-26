using SmartGarden.ConnectorService.EntityFramework.Models;

namespace SmartGarden.ConnectorService.EntityFramework.Seeding;

public class ConnectionServiceSeedModel
{
    public List<ModuleRef> Modules { get; set; } = [];
}