using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.GraphQL;

public partial class Mutation
{
    public async Task<BedDto> SetPlantToBed([ID] Guid bedId, [ID] Guid plantId,
                                            [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        var plant = await db.Get<Plant>().FirstOrDefaultAsync(p => p.Id == plantId);
        if (plant == null)
            throw new GraphQLException($"Plant with id {plantId} not found");
        bed.Plant = plant;
        await db.SaveChangesAsync();
        return BedDto.FromEntity.Compile().Invoke(bed);
    }
}