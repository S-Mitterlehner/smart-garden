using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;

public class PlantsController(ApplicationContext db) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetPlants() =>
       Ok(await db
                 .Get<Plant>()
                 .Select(PlantDto.FromEntity)
                 .ToListAsync());
}