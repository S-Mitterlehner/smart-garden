using LinqKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;

public class SensorsController(ApplicationContext db) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await db.Get<SensorRef>().Select(SensorRefDto.FromEntity).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var sensor = await db.Get<SensorRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (sensor == null) return NotFound();
        return Ok(SensorDto.FromEntity.Invoke(sensor));
    }
}