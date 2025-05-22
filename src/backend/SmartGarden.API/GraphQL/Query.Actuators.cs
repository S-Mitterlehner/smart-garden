using LinqKit;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.GraphQL;

public partial class Query
{
    [UseFiltering]
    public async Task<IEnumerable<ActuatorRefDto>> GetActuators([Service] ApplicationDbContext db) => await db.Get<ModuleRef>()
                                                                                                              .Where(x => ModuleTypeExpressions.IsActuator.Invoke(x.Type))
                                                                                                              .Select(ActuatorDto.FromEntity)
                                                                                                              .ToListAsync();

    [UseFiltering]
    public async Task<ActuatorDto?> GetActuator(Guid id,
                                                [Service] ApplicationDbContext db, [Service] IApiModuleManager moduleManager)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => ModuleTypeExpressions.IsActuator.Invoke(x.Type) && x.Id == id);
        if (reference == null) return null;
        
        var connector = await moduleManager.GetConnectorAsync(reference);
        var state = await connector.GetStateAsync();
        
        return new ActuatorDto
        {
            Id = reference.Id
            , Name = reference.Name
            , Key = reference.ModuleKey
            , Type = reference.Type
            , Description = connector.Description
            , State = ActuatorStateDto.FromState(state, await connector.GetActionsAsync())
        };
    }
}