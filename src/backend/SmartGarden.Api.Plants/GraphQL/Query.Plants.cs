using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Plants.Dtos;
using SmartGarden.EntityFramework.Plants;
using SmartGarden.EntityFramework.Plants.Models;

namespace SmartGarden.Api.Plants.GraphQL;

public partial class Query
{
    [UseFiltering]
    public async Task<IEnumerable<PlantDto>> GetPlants([Service] PlantsDbContext db) => 
        await db.Get<Plant>().Select(PlantDto.FromEntity).ToListAsync();

    [UseFiltering]
    public async Task<PlantDto?> GetPlant(Guid id, [Service] PlantsDbContext db)
    {
        var plant = await db.Get<Plant>().FirstOrDefaultAsync(x => x.Id == id);
        if (plant is null) return null;

        return PlantDto.FromEntity.Compile().Invoke(plant);
    }
}