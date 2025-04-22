using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;
public class ActuatorRefDto : BaseDto
{
    public string Name { get; set; }

    public static Expression<Func<Actuator, ActuatorRefDto>> FromEntity => s => new ActuatorRefDto
    {
        Id = s.Id,
        Name = s.Name
    };
}

public class ActuatorDto : ActuatorRefDto
{
    public string Description { get; set; }
    public IEnumerable<ActuatorActionDto> Actions { get; set; } = new List<ActuatorActionDto>();

    public static Expression<Func<Actuator, ActuatorDto>> FromEntity =>
        c => new ActuatorDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            Actions = c.Actions.AsQueryable().Select(ActuatorActionDto.FromEntity).ToList()
        };
}

public class ActuatorActionDto 
{
    public string Key { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; }
    public bool IsAllowed { get; set; }

    public static Expression<Func<ActuatorAction, ActuatorActionDto>> FromEntity => ca => new ActuatorActionDto
    {
        Key = ca.Key,
        Name = ca.Name,
        Description = ca.Description,
        Icon = ca.Icon.ToString().ToLower(),
        IsAllowed = true // TODO: Add logic to check if action is allowed
    };
}