using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.Controllers.Base;

public abstract class BaseBedController(ApplicationDbContext db) : BaseController
{
    
    [FromRoute(Name = "id")]
    public Guid BedId { get; set; }

    protected async Task<Bed?> GetBedAsync()
    {
        return await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == BedId);
    }
}