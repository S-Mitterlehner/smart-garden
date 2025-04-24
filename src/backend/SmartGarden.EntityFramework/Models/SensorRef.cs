using SmartGarden.Core.Enums;

namespace SmartGarden.EntityFramework.Models;

public class SensorRef : BaseEntityWithOrder
{
    public string Name { get; set; }
    public string Description { get; set; }
    public SensorType Type { get; set; }
    public string? ConnectorKey { get; set; }

    public string? Topic { get; set; }
}