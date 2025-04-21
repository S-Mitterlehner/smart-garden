using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class PlantDto : BaseDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }

    public static Expression<Func<Plant, PlantDto>> FromEntity =>
        p => new PlantDto
        {
            Description = p.Description
            , Name = p.Name
            , ImageUrl = p.ImageUrl
            , Id = p.Id
        };
}