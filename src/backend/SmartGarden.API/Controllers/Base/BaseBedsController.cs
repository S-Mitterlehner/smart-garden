using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers.Base;

public abstract class BaseBedsController(ApplicationContext db) : BaseController
{
    
    [FromRoute(Name = "id")]
    public Guid BedId { get; set; }

    protected async Task<Bed?> GetBedAsync()
    {
        return await EntityFrameworkQueryableExtensions.FirstOrDefaultAsync<Bed>(db.Get<Bed>(), x => x.Id == BedId);
    }
}