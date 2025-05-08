using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API;

public class GraphQLQuery
{
    [UseFiltering]
    public IEnumerable<BedDto> GetBeds(ApplicationContext db)
    {
        return db.Get<Bed>().Select(BedDto.FromEntity);
    }
    
    [UseFiltering]
    public IEnumerable<PlantDto> GetPlants(ApplicationContext db)
    {
        return db.Get<Plant>().Select(PlantDto.FromEntity);
    }
}