using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class BedDto : BaseDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public PlantRefDto Plant { get; set; }
    public List<SensorRefDto> Sensors { get; set; }
    public List<ControllerRefDto> Controllers { get; set; }

    public static Expression<Func<Bed, BedDto>> FromEntity =>
        b => new BedDto
        {
            Id = b.Id
            , Name = b.Name
            , Description = b.Description
            , Sensors = b.Sensors.Select(SensorRefDto.FromEntity.Compile()).ToList()
            , Controllers = b.Controllers.Select(ControllerRefDto.FromEntity.Compile()).ToList()
            , Plant = b.Plant == null ? null : PlantRefDto.FromEntity.Compile().Invoke(b.Plant)
        };
}