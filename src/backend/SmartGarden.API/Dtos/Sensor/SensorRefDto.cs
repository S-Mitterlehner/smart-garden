using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos.Sensor;

public class SensorRefDto : BaseDto
{
    public string Type { get; set; } 
    public string Name { get; set; }
    public string Description { get; set; }
    public string? Key { get; set; }
    
    public static Expression<Func<SensorRef, SensorRefDto>> FromEntity => s => new SensorRefDto
    {
        Id = s.Id,
        Name = s.Name,
        Description = s.Description,
        Type = s.Type.ToString(),
        Key = s.ConnectorKey
    };
}