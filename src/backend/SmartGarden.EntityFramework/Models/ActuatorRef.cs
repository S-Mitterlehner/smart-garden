using SmartGarden.Modules.Enums;

namespace SmartGarden.EntityFramework.Models;

public class ActuatorRef : BaseEntityWithOrder
{
    public string Name { get; set; }
    public string? Description { get; set; }
    public ActuatorType Type { get; set; }
    public string? ConnectorKey { get; set; }
    public string? Topic { get; set; }
}
