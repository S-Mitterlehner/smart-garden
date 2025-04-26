using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;

[Route("Beds/{id}/Actuators")]
public class BedActuatorsController(ApplicationContext db) : BaseController
{
    [FromRoute(Name = "id")]
    public Guid BedId { get; set; }

    [HttpPatch("{actuatorId}")]
    public async Task<IActionResult> AddActuator(Guid actuatorId)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == BedId);

        if (bed == null)
            return NotFound($"bed with id {BedId} not found");

        if (bed.Actuators.Any(x => x.Id == actuatorId))
            return BadRequest("Actuator already added to this bed");

        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == actuatorId);
        if (reference == null)
            return NotFound($"actuator with id {actuatorId} not found");

        bed.Actuators.Add(reference);
        await db.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{actuatorId}")]
    public async Task<IActionResult> RemoveActuator(Guid actuatorId)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == BedId);

        if (bed == null)
            return NotFound($"bed with id {BedId} not found");

        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == actuatorId);
        if (reference == null)
            return NotFound($"actuator with id {actuatorId} not found");

        bed.Actuators.Remove(reference);
        await db.SaveChangesAsync();

        return Ok();
    }
}