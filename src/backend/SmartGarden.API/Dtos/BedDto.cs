using System.Linq.Expressions;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Dtos.Automation;
using SmartGarden.API.Dtos.Module;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class BedDto : BaseDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public PlantRefDto Plant { get; set; }
    public List<ModuleRefDto> Modules { get; set; }
    //public List<SensorRefDto> Sensors { get; set; } = new();
    //public List<ActuatorRefDto> Actuators { get; set; } = new();
    public List<AutomationRuleDto> Rules { get; set; } = new();

    public static Expression<Func<Bed, BedDto>> FromEntity =>
        b => new BedDto
        {
            Id = b.Id
            , Name = b.Name
            , Description = b.Description
            , Modules = b.Modules.OrderBy(x => x.Order).AsQueryable().Select(ModuleRefDto.FromEntity).ToList()
            //, Actuators = b.Actuators.OrderBy(x => x.Order).AsQueryable().Select(ActuatorRefDto.FromEntity).ToList()
            , Rules = b.Rules.OrderBy(x => x.Order).AsQueryable().Select(AutomationRuleDto.FromEntity).ToList()
            , Plant = b.Plant == null ? null : PlantRefDto.FromEntity.Compile().Invoke(b.Plant)
        };
}