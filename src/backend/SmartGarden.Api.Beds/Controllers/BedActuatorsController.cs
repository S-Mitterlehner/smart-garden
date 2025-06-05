using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Controllers.Base;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.Controllers;

[Route("Beds/{id}/Actuators")]
public class BedActuatorsController(ApplicationDbContext db) : BaseBedController(db)
{

    [HttpPatch("{actuatorId}")]
    public async Task<IActionResult> AddActuator(Guid actuatorId)
    {
        var bed = await GetBedAsync();

        if (bed == null)
            return NotFound($"bed with id {BedId} not found");

        if (bed.Actuators.Any(x => x.Id == actuatorId))
            return BadRequest("Actuator already added to this bed");

        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == actuatorId);
        if (reference == null)
            return NotFound($"actuator with id {actuatorId} not found");

        bed.Modules.Add(reference);
        await db.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{actuatorId}")]
    public async Task<IActionResult> RemoveActuator(Guid actuatorId)
    {
        var bed = await GetBedAsync();

        if (bed == null)
            return NotFound($"bed with id {BedId} not found");

        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == actuatorId);
        if (reference == null)
            return NotFound($"actuator with id {actuatorId} not found");

        bed.Modules.Remove(reference);
        await db.SaveChangesAsync();

        return Ok();
    }
}