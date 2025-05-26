using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Controllers.Base;
using SmartGarden.API.Dtos.Module;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Api;

namespace SmartGarden.API.Controllers;

public class ModulesController(ApplicationDbContext db, IApiModuleManager moduleManager, IMessagingProducer messaging) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Get<ModuleRef>().Select(ModuleDto.FromEntity).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) return NotFound();
        
        var connector = await moduleManager.GetConnectorAsync(reference);
        var state = await connector.GetStateAsync();

        return Ok(new ModuleDto
        {
            Id  = reference.Id,
            Name = reference.Name,
            Key = reference.ModuleKey,
            Type = reference.Type,
            Description = connector.Description,
            State = ModuleStateDto.FromState(state, await connector.GetActionsAsync())
        });
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateRef([FromBody] ModuleRefDto Module)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == Module.Id);
     
        if (reference == null) return NotFound();

        reference.Name = Module.Name;
        reference.Description = Module.Description;
        
        await db.SaveChangesAsync();
        
        return Ok();
    }

    [HttpHead("{id}/action/{actionKey}")]
    public async Task<IActionResult> ExecuteAction(Guid id, string actionKey, [FromQuery] double? value)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == id);
        
        if (reference == null) return NotFound();

        var connector = await moduleManager.GetConnectorAsync(reference);
        var action = await connector.GetActionDefinitionByKeyAsync(actionKey);
        
        if (action == null) return NotFound();
        if (action.ActionType == Modules.Enums.ActionType.Value && value == null)
            return BadRequest("Action requires a value");

        var execution = new ActionExecutionMessageBody
        {
            ModuleKey = connector.Key, 
            ActionKey = actionKey, 
            Value = value
        };
        await messaging.SendAsync(new ActionExecutionMessage(execution));
        return NoContent();
    }
}