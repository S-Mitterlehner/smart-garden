using System.Linq.Expressions;
using SmartGarden.EntityFramework.Enums;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class SensorRefDto : BaseDto
{
    public static Expression<Func<Sensor, SensorRefDto>> FromEntity => s => new SensorRefDto
    {
        Id = s.Id,
    };
}

public class SensorDto : SensorRefDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public double MinValue { get; set; }
    public double MaxValue { get; set; }
    public string Unit { get; set; }
    public string Type { get; set; } // TODO: Export in OpenApi for Frontend

    public static Expression<Func<Sensor, SensorDto>> FromEntity => s => new SensorDto
    {
        Id = s.Id,
        Name = s.Name,
        Description = s.Description,
        MinValue = s.Min,
        MaxValue = s.Max,
        Unit = s.Unit,
        Type = s.Type.ToString().ToUpper()
    };
}