using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class ControllerDto : BaseDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public IEnumerable<ControllerActionDto> Actions { get; set; } = new List<ControllerActionDto>();

    public static Expression<Func<Controller, ControllerDto>> FromEntity =>
        c => new ControllerDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            Actions = c.Actions.AsQueryable().Select(ControllerActionDto.FromEntity).ToList()
        };
}

public class ControllerActionDto 
{
    public string Key { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; }
    public bool IsAllowed { get; set; }

    public static Expression<Func<ControllerAction, ControllerActionDto>> FromEntity => ca => new ControllerActionDto
    {
        Key = ca.Key,
        Name = ca.Name,
        Description = ca.Description,
        Icon = ca.Icon.ToString().ToLower(),
        IsAllowed = true // TODO: Add logic to check if action is allowed
    };
}