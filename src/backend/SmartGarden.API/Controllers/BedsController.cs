using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Controllers.Base;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;


public class BedsController(ApplicationContext db) : BaseController
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