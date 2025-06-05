using LinqKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Controllers.Base;
using SmartGarden.Api.Beds.Dtos;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.Controllers;

public class PlantsController(ApplicationDbContext db) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetPlants() =>
       Ok(await db
                 .Get<Plant>()
                 .Select(PlantDto.FromEntity)
                 .ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPlant(Guid id)
    {
        var plant = await db.Get<Plant>().FirstOrDefaultAsync(x => x.Id == id);        
        if (plant is null)
            return NotFound();
        return Ok(PlantDto.FromEntity.Invoke(plant));
    }
}