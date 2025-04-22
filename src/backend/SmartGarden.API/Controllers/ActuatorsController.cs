using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Actuators;
using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

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
        
        var connector = actuatorManager.GetConnector(reference.ConnectorKey, reference.Type);
        var state = await connector.GetStateAsync();
        var actions = await connector.GetActionsAsync();

        return Ok(new ActuatorDto
        {
            Id  = reference.Id,
            Name = reference.Name,
            Description = connector.Description,
            State = ActuatorStateDto.FromState(state),
            Actions = actions.AsQueryable().Select(ActuatorActionDto.FromEntity).ToList()
        });
    }

    [HttpHead("{id}/action/{actionKey}")]
    public async Task<IActionResult> ExecuteAction(Guid id, string actionKey, [FromQuery] double? value)
    {
        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == id);
        
        if (reference == null) return NotFound();

        var connector = actuatorManager.GetConnector(reference.ConnectorKey, reference.Type);
        var action = await connector.GetActionDefinitionByKeyAsync(actionKey);
        
        if (action == null) return NotFound();
        if (action.ActionType == ActionType.Value && value == null)
            return BadRequest("Action requires a value");

        ActionExecution execution = action.ActionType switch
        {
            ActionType.Command => new CommandActionExecution
            {
                Key = actionKey
            },
            ActionType.Value => new ValueActionExecution
            {
                Key = actionKey,
                Value = value ?? 0
            },
            _ => throw new ArgumentException("what?")
        };

        await connector.ExecuteAsync(execution);
        return NoContent();
    }
}