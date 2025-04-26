using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;

[Route("Beds/{id}/Sensors")]
public class BedSensorsController(ApplicationContext db) : BaseController
{
    [FromRoute(Name = "id")]
    public Guid BedId { get; set; }

    [HttpPatch("{sensorId}")]
    public async Task<IActionResult> AddSensor(Guid sensorId)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == BedId);

        if (bed == null)
            return NotFound($"bed with id {BedId} not found");

        if (bed.Sensors.Any(x => x.Id == sensorId))
            return BadRequest("Sensor already added to this bed");

        var reference = await db.Get<SensorRef>().FirstOrDefaultAsync(x => x.Id == sensorId);
        if (reference == null)
            return NotFound($"sensor with id {sensorId} not found");

        bed.Sensors.Add(reference);
        await db.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{sensorId}")]
    public async Task<IActionResult> RemoveSensor(Guid sensorId)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == BedId);

        if (bed == null)
            return NotFound($"bed with id {BedId} not found");

        var reference = await db.Get<SensorRef>().FirstOrDefaultAsync(x => x.Id == sensorId);
        if (reference == null)
            return NotFound($"sensor with id {sensorId} not found");

        bed.Sensors.Remove(reference);
        await db.SaveChangesAsync();

        return Ok();
    }
}