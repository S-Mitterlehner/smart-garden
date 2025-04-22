using LinqKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;

public class ActuatorsController(ApplicationContext db) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Get<Actuator>().Select(ActuatorDto.FromEntity).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var controller = await db.Get<Actuator>().FirstOrDefaultAsync(x => x.Id == id);
        if (controller == null) return NotFound();
        return Ok(ActuatorDto.FromEntity.Invoke(controller));
    }
}