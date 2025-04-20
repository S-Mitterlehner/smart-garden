using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.DataAccess;
using SmartGarden.DataAccess.Models;

namespace SmartGarden.API.Controllers;

[ApiController]
[Route("[controller]")]
public class PlantsController(ApplicationContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPlants()
    {
        var plants = await db
                           .Get<Plant>()
                           .Select(PlantDto.FromEntity)
                           .ToListAsync();
        return Ok(plants);
    }
}