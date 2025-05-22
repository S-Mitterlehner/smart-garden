using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.GraphQL;

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