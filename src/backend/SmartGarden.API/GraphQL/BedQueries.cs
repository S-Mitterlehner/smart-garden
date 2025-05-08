using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.API.GraphQL;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API;

[ExtendObjectType(typeof(Query))]
public class BedQueries
{
    // Get by ID
    // {
    //     beds(where: { id: { eq: "a3c51a2a-0b07-442f-af31-3b7d88dda10d" } }) {
    //         name
    //             description
    //     }
    // }
    
    // Directly from DB with custom name
    // [GraphQLName("allBeds")]
    // [UseProjection]
    // [UseFiltering]
    // public IQueryable<Bed> GetBeds2(ApplicationContext db) => db.Get<Bed>();
    
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