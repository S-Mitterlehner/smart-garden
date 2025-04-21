using SmartGarden.EntityFramework.Models;
using System.Linq.Expressions;

namespace SmartGarden.API.Dtos;

public class ControllerRefDto : BaseDto
{
    
    public static Expression<Func<Controller, ControllerRefDto>> FromEntity => s => new ControllerRefDto
    {
        Id = s.Id,
    };
}