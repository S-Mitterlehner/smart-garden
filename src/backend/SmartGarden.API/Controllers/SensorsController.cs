using LinqKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Sensors;

namespace SmartGarden.API.Controllers;

public class SensorsController(ApplicationContext db, ISensorManager sensorManager) : BaseController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<SensorRefDto>))]
    public async Task<IActionResult> Get() => Ok(await db.Get<SensorRef>().Select(SensorRefDto.FromEntity).ToListAsync());

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SensorDto))]
    public async Task<IActionResult> Get(Guid id)
    {
        var reference = await db.Get<SensorRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) return NotFound();

        var connector = await sensorManager.GetConnectorAsync(reference.ConnectorKey, reference.Type);

        if (connector == null) return NotFound();

        var data = await connector.GetDataAsync();

        return Ok(new SensorDto
        {
            Id = reference.Id,
            Name = reference.Name,
            Key = reference.ConnectorKey,
            Description = reference.Description,
            Unit = data.Unit,
            MaxValue = data.Max,
            MinValue = data.Min,
            CurrentValue = data.CurrentValue,
            Type = reference.Type.ToString().ToUpper()
        });
    }
}