using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;

public class SensorsController(ApplicationContext db) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await db.Get<Sensor>().Select(SensorRefDto.FromEntity).ToListAsync());
}