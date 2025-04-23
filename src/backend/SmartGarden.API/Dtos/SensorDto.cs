using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class SensorRefDto : BaseDto
{
    public string Type { get; set; } 
    public string Name { get; set; }
    public string? Key { get; set; }
    
    public static Expression<Func<SensorRef, SensorRefDto>> FromEntity => s => new SensorRefDto
    {
        Id = s.Id,
        Name = s.Name,
        Type = s.Type.ToString().ToUpper(),
        Key = s.ConnectorKey
    };
}

public class SensorDto : SensorRefDto
{
    public string Description { get; set; }
    public double CurrentValue { get; set; }
    public double MinValue { get; set; }
    public double MaxValue { get; set; }
    public string Unit { get; set; }
}

public class SensorDataDto
{
    public string SensorKey { get; set; }
    public string SensorType { get; set; }
    public string ConnectionState { get; set; }
    public double CurrentValue { get; set; }
    public double Min { get; set; }
    public double Max { get; set; }
    public string Unit { get; set; }
}