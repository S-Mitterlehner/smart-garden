using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.GraphQL;

public partial class Query
{
    [UseFiltering]
    public async Task<IEnumerable<BedDto>> GetBeds([Service] ApplicationContext db) => await db.Get<Bed>().Select(BedDto.FromEntity).ToListAsync();

    [UseFiltering]
    public async Task<BedDto?> GetBed(Guid id, [Service] ApplicationContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == id);
        if (bed == null) return null;
        return BedDto.FromEntity.Compile().Invoke(bed);
    }
}