using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Controllers.Base;
using SmartGarden.API.Dtos.Automation;
using SmartGarden.API.Helper;
using SmartGarden.EntityFramework;
using SmartGarden.Modules.Api;
using SmartGarden.Modules.Models;

namespace SmartGarden.API.Controllers;

[Route("Beds/{id}/Automation")]
public class BedAutomationController(ApplicationDbContext db, IApiModuleManager moduleManager) 
    : BaseBedController(db)
{
    [HttpGet("config")]
    public async Task<IActionResult> GetConfig()
    {
        var bed = await GetBedAsync();
        if (bed == null) return NotFound();

        var moduleConfig = new List<AutomationConfig>();

        foreach (var sensor in bed.Modules)
        {
            var connector = await moduleManager.GetConnectorAsync(sensor);
            moduleConfig.Add(await connector.GetAutomationConfigAsync());
        }

        moduleConfig.AddRange(AutomationHelper.GetMiscAutomationConfig());

        var parameters = moduleConfig.AsQueryable().GroupBy(x => x.Group).Select(g => new ParameterGroupDto
        {
            Key = g.Key.Replace("-", "_"),
            Label = g.Key.Replace("_", "-"),
            Fields = g.AsQueryable().Select(ParameterFieldDto.FromModel).ToList()
        }).ToList();

        return Ok(new AutomationConfigDto
        {
            Parameters = parameters
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bed = await GetBedAsync();
        
        if (bed == null) return NotFound();

        return Ok(await bed.Rules.AsQueryable().Select(AutomationRuleDto.FromEntity).ToListAsync());
    }
    

    [HttpGet("{ruleId}")]
    public async Task<IActionResult> GetRuleById(Guid ruleId)
    {
        var bed = await GetBedAsync();
        
        if (bed == null) return NotFound();

        return Ok(await bed.Rules.AsQueryable().Select(AutomationRuleDto.FromEntity).FirstOrDefaultAsync(x => x.Id == ruleId));
    }

    [HttpPost]
    public async Task<IActionResult> Save([FromBody] AutomationRuleDto dto)
    {
        // TODO
        // TODO: send message to rmq

        return Ok();
    }
    
    [HttpDelete("{ruleId}")]
    public async Task<IActionResult> Delete(Guid ruleId)
    {
        var bed = await GetBedAsync();
        if (bed == null) return NotFound();

        var rule = bed.Rules.FirstOrDefault(x => x.Id == ruleId);
        if (rule == null) return NotFound();

        db.Remove(rule);
        await db.SaveChangesAsync();

        return NoContent();
    }
}