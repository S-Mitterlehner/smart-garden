using LinqKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Controllers.Base;
using SmartGarden.Api.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.Api.Controllers;

public class PlantsController(PlantsDbContext db) : BaseController
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