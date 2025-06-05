using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Dtos;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.GraphQL;

public partial class Query
{
    [UseFiltering]
    public async Task<IEnumerable<PlantDto>> GetPlants([Service] ApplicationDbContext db) => await db.Get<Plant>().Select(PlantDto.FromEntity).ToListAsync();

    [UseFiltering]
    public async Task<PlantDto?> GetPlant(Guid id, [Service] ApplicationDbContext db)
    {
        var plant = await db.Get<Plant>().FirstOrDefaultAsync(x => x.Id == id);
        if (plant is null) return null;

        return PlantDto.FromEntity.Compile().Invoke(plant);
    }
}