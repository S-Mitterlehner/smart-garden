using LinqKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;

namespace SmartGarden.API.Controllers;

public class ControllersController(ApplicationContext db) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Get<EntityFramework.Models.Controller>().Select(ControllerDto.FromEntity).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var controller = await db.Get<EntityFramework.Models.Controller>().FirstOrDefaultAsync(x => x.Id == id);
        if (controller == null) return NotFound();
        return Ok(ControllerDto.FromEntity.Invoke(controller));
    }
}