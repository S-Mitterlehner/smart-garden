using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Dtos;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.GraphQL;

public partial class Query
{
    [UseFiltering]
    public async Task<IEnumerable<BedDto>> GetBeds([Service] ApplicationDbContext db) => await db.Get<Bed>().Select(BedDto.FromEntity).ToListAsync();

    [UseFiltering]
    public async Task<BedDto?> GetBed(Guid id, [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == id);
        if (bed == null) return null;
        return BedDto.FromEntity.Compile().Invoke(bed);
    }
}