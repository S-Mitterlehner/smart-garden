using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;

[Route("Beds/{id}/Rules")]
public class BedRulesController(ApplicationContext db) : BaseController
{
    [FromRoute(Name="id")]
    public Guid BedId { get; set; }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == BedId);
        
        if (bed == null) return NotFound();

        return Ok(bed.Rules.AsQueryable().Select(AutomationRuleDto.FromEntity).ToList());
    }
}