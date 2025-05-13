using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Actuators;

namespace SmartGarden.API.GraphQL;

public partial class Query
{
    [UseFiltering]
    public async Task<IEnumerable<ActuatorRefDto>> GetActuators([Service] ApplicationContext db) => await db.Get<ActuatorRef>().Select(ActuatorDto.FromEntity).ToListAsync();

    [UseFiltering]
    public async Task<ActuatorDto?> GetActuator(Guid id,
                                                [Service] ApplicationContext db, [Service] IActuatorManager actuatorManager)
    {
        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) return null;
        var connector = await actuatorManager.GetConnectorAsync(reference);
        var state = await connector.GetStateAsync();
        return new ActuatorDto
        {
            Id = reference.Id
            , Name = reference.Name
            , Key = reference.ConnectorKey
            , Type = reference.Type.ToString()
            , Description = connector.Description
            , State = ActuatorStateDto.FromState(state, await connector.GetActionsAsync())
        };
    }
}