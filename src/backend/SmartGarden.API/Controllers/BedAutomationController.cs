using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Controllers.Base;
using SmartGarden.API.Dtos.Automation;
using SmartGarden.EntityFramework;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Sensors;

namespace SmartGarden.API.Controllers;

[Route("Beds/{id}/Automation")]
public class BedAutomationController(ApplicationContext db, IActuatorManager actuatorManager, ISensorManager sensorManager) 
    : BaseBedController(db)
{
    [HttpGet("config")]
    public async Task<IActionResult> GetConfig()
    {
        var bed = await GetBedAsync();
        if (bed == null) return NotFound();

        var moduleConfig = new List<ModuleAutomationConfig>();

        foreach (var sensor in bed.Sensors)
        {
            var connector = await sensorManager.GetConnectorAsync(sensor);
            moduleConfig.Add(await connector.GetAutomationConfigAsync());
        }

        foreach (var reference in bed.Actuators)
        {
            var connector = await actuatorManager.GetConnectorAsync(reference);
            moduleConfig.Add(await connector.GetAutomationConfigAsync());
        }

        var fields = moduleConfig.AsQueryable().Select(ParameterFieldDto.FromModel).ToList();

        return Ok(new AutomationConfigDto
        {
            Fields = fields
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