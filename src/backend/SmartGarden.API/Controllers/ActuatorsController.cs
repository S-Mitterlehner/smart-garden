using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Enums;
using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.API.Controllers;

public class ActuatorsController(ApplicationContext db, IActuatorManager actuatorManager) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Get<ActuatorRef>().Select(ActuatorDto.FromEntity).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) return NotFound();
        
        var connector = await actuatorManager.GetConnectorAsync(reference);
        var state = await connector.GetStateAsync();

        return Ok(new ActuatorDto
        {
            Id  = reference.Id,
            Name = reference.Name,
            Key = reference.ConnectorKey,
            Type = reference.Type.ToString(),
            Description = connector.Description,
            State = ActuatorStateDto.FromState(state, await connector.GetActionsAsync())
        });
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateRef([FromBody] ActuatorRefDto actuator)
    {
        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == actuator.Id);
     
        if (reference == null) return NotFound();

        reference.Name = actuator.Name;
        reference.Description = actuator.Description;
        
        await db.SaveChangesAsync();
        
        return Ok();
    }

    [HttpHead("{id}/action/{actionKey}")]
    public async Task<IActionResult> ExecuteAction(Guid id, string actionKey, [FromQuery] double? value)
    {
        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == id);
        
        if (reference == null) return NotFound();

        var connector = await actuatorManager.GetConnectorAsync(reference);
        var action = await connector.GetActionDefinitionByKeyAsync(actionKey);
        
        if (action == null) return NotFound();
        if (action.ActionType == ActionType.Value && value == null)
            return BadRequest("Action requires a value");

        var execution = new ActionExecution {Key = actionKey, Type = action.ActionType, Value = value};

        await connector.ExecuteAsync(execution);
        return NoContent();
    }
}