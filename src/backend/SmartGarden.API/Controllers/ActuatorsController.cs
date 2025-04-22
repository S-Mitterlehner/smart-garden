using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Actuators;
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
}