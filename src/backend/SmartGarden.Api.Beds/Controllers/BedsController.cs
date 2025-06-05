using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Controllers.Base;
using SmartGarden.Api.Beds.Dtos;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.Controllers;


public class BedsController(ApplicationDbContext db) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll() 
        => Ok(db.Get<Bed>().Select(BedDto.FromEntity).ToList());

    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBed(Guid id)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == id);
        if (bed == null)
            return NotFound();
        return Ok(BedDto.FromEntity.Compile().Invoke(bed));
    }
}