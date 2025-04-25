using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos.Actuator;

public class ActuatorRefDto : BaseDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Key { get; set; }
    public string Type { get; set; }

    public static Expression<Func<ActuatorRef, ActuatorRefDto>> FromEntity => s => new ActuatorRefDto
    {
        Id = s.Id,
        Name = s.Name,
        Description = s.Description,
        Key = s.ConnectorKey,
        Type = s.Type.ToString()
    };
}