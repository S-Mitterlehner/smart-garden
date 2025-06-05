using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Controllers.Base;
using SmartGarden.Api.Beds.Dtos.Sensor;
using SmartGarden.Api.Core.Controller;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;
using SmartGarden.Modules.Api;

namespace SmartGarden.Api.Beds.Controllers;

public class SensorsController(ApplicationDbContext db, IApiModuleManager moduleManager) : BaseController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<SensorRefDto>))]
    public async Task<IActionResult> Get() => Ok(await db.Get<ModuleRef>().Select(SensorRefDto.FromEntity).ToListAsync());

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SensorDto))]
    public async Task<IActionResult> Get(Guid id)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) return NotFound();

        var connector = await moduleManager.GetConnectorAsync(reference);
        var data = await connector.GetStateAsync();

        return Ok(new SensorDto
        {
            Id = reference.Id,
            Name = reference.Name,
            Key = reference.ModuleKey,
            Description = reference.Description,
            Unit = data.Unit,
            MaxValue = data.Max ?? -1,
            MinValue = data.Min ?? -1,
            CurrentValue = data.CurrentValue ?? -1,
            Type = reference.Type
        });
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateRef([FromBody] SensorRefDto sensor)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == sensor.Id);

        if (reference == null) return NotFound();

        reference.Name = sensor.Name;
        reference.Description = sensor.Description;

        await db.SaveChangesAsync();

        return Ok();
    }
}