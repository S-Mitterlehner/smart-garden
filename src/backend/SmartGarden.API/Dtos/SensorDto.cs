using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class SensorRefDto : BaseDto
{
    public string Type { get; set; } 
    public string Name { get; set; }
    public static Expression<Func<SensorRef, SensorRefDto>> FromEntity => s => new SensorRefDto
    {
        Id = s.Id,
        Name = s.Name,
        Type = s.Type.ToString().ToUpper()
    };
}

public class SensorDto : SensorRefDto
{
    public string Description { get; set; }
    public double MinValue { get; set; }
    public double MaxValue { get; set; }
    public string Unit { get; set; }

    public static Expression<Func<SensorRef, SensorDto>> FromEntity => s => new SensorDto
    {
        Id = s.Id,
        Name = s.Name,
        Type = s.Type.ToString().ToUpper(),
        Description = s.Description,
        MinValue = s.Min,
        MaxValue = s.Max,
        Unit = s.Unit,
    };
}