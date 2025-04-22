using System.Linq.Expressions;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class BedDto : BaseDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public PlantRefDto Plant { get; set; }
    public List<SensorRefDto> Sensors { get; set; }
    public List<ActuatorRefDto> Actuators { get; set; }

    public static Expression<Func<Bed, BedDto>> FromEntity =>
        b => new BedDto
        {
            Id = b.Id
            , Name = b.Name
            , Description = b.Description
            , Sensors = b.Sensors.OrderBy(x => x.Order).Select(SensorRefDto.FromEntity.Compile()).ToList()
            , Actuators = b.Actuators.OrderBy(x => x.Order).Select(ActuatorRefDto.FromEntity.Compile()).ToList()
            , Plant = b.Plant == null ? null : PlantRefDto.FromEntity.Compile().Invoke(b.Plant)
        };
}