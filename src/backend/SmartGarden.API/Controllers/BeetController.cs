using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Controllers;


public class BeetController(ApplicationContext db) : BaseController
{
    [HttpGet("id")]
    public async Task<IActionResult> GetBeet(Guid id)
    {
        var beet = await db.Get<Beet>().FirstOrDefaultAsync(x => x.Id == id);
        if (beet == null)
            return NotFound();
        return Ok(BeetDto.FromEntity.Compile().Invoke(beet));
    }
}