using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Dtos;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.GraphQL;

public partial class Mutation
{
    public async Task<BedDto> SetPlantToBed([ID] Guid bedId, [ID] Guid plantId,
                                            [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        
        await db.SaveChangesAsync();
        return BedDto.FromEntity.Compile().Invoke(bed);
    }
}