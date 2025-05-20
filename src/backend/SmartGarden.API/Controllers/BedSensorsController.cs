using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Controllers.Base;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;

[Route("Beds/{id}/Sensors")]
public class BedSensorsController(ApplicationDbContext db) : BaseBedController(db)
{

    [HttpPatch("{sensorId}")]
    public async Task<IActionResult> AddSensor(Guid sensorId)
    {
        var bed = await GetBedAsync();

        if (bed == null)
            return NotFound($"bed with id {BedId} not found");

        if (bed.Sensors.Any(x => x.Id == sensorId))
            return BadRequest("Sensor already added to this bed");

        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == sensorId);
        if (reference == null)
            return NotFound($"sensor with id {sensorId} not found");

        bed.Modules.Add(reference);
        await db.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{sensorId}")]
    public async Task<IActionResult> RemoveSensor(Guid sensorId)
    {
        var bed = await GetBedAsync();

        if (bed == null)
            return NotFound($"bed with id {BedId} not found");

        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == sensorId);
        if (reference == null)
            return NotFound($"sensor with id {sensorId} not found");

        bed.Modules.Remove(reference);
        await db.SaveChangesAsync();

        return Ok();
    }
}