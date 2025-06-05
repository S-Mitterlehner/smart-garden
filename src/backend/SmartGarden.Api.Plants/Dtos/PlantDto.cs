using System.Linq.Expressions;
using SmartGarden.Api.Core.Dtos;
using SmartGarden.EntityFramework.Plants.Models;

namespace SmartGarden.Api.Plants.Dtos;

public class PlantRefDto : BaseDto
{
    public static Expression<Func<Plant, PlantRefDto>> FromEntity =>
        p => new PlantRefDto
        {
            Id = p.Id,
        };
}

public class PlantDto : PlantRefDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }

    public IEnumerable<PlantModuleConfigDto> ModuleConfigs { get; set; } = new List<PlantModuleConfigDto>();

    public static Expression<Func<Plant, PlantDto>> FromEntity =>
        p => new PlantDto
        {
            Description = p.Description
            , Name = p.Name
            , ImageUrl = p.ImageUrl
            , Id = p.Id
            , ModuleConfigs = p.ModuleConfigs.AsQueryable().Select(PlantModuleConfigDto.FromEntity).ToList()
        };
}