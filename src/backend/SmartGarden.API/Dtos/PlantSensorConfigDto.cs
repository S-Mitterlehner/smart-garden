using System.Linq.Expressions;
using SmartGarden.EntityFramework.Enums;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class PlantSensorConfigDto
{
    public string SensorType { get; set; }
    public double RangeFrom { get; set; }
    public double RangeTo { get; set; }

    public static Expression<Func<PlantSensorConfig, PlantSensorConfigDto>> FromEntity => c => new PlantSensorConfigDto
    {
        RangeFrom = c.RangeFrom,
        RangeTo = c.RangeTo,
        SensorType = c.SensorType.ToString().ToUpper()
    };
}