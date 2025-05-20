using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Enums;
using ActionType = SmartGarden.Modules.Enums.ActionType;

namespace SmartGarden.API.GraphQL;

public partial class Mutation
{
    public async Task<ModuleRef?> UpdateActuatorRef([ID] Guid id, string? name, string? description,
                                                      [Service] ApplicationDbContext db)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) throw new GraphQLException("Actuator not found.");
        if (name is not null) reference.Name = name;
        if (description is not null) reference.Description = description;
        await db.SaveChangesAsync();
        return reference;
    }

    public async Task<bool> ExecuteActuatorAction([ID] Guid id, string actionKey, double? value,
                                                  [Service] ApplicationDbContext db, 
                                                  [Service] IApiModuleManager actuatorManager,
                                                  [Service] IMessagingProducer messaging)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) return false;
        
        var connector = await actuatorManager.GetConnectorAsync(reference);
        var action = await connector.GetActionDefinitionByKeyAsync(actionKey);
        
        if (action == null) throw new GraphQLException("Action not found.");
        if (action.ActionType == ActionType.Value && value == null)
            throw new GraphQLException("This action requires a value.");
        
        var execution = new ActuatorExecutionMessageBody
        {
            ActuatorKey = connector.Key, 
            ActionKey = actionKey, 
            Type = (Messaging.Messages.ActionType)action.ActionType, 
            Value = value
        };
        await messaging.SendAsync(new ActuatorExecutionMessage(execution));
        
        return true;
    }

    public async Task<ModuleRef> AddActuatorToBed([ID] Guid bedId, [ID] Guid actuatorId,
                                                    [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        if (bed.Modules.Any(a => (a.Type & ModuleType.Actuator) != 0 && a.Id == actuatorId))
            throw new GraphQLException("Actuator already added to this bed");
        var actuator = await db.Get<ModuleRef>().FirstOrDefaultAsync(a => a.Id == actuatorId);
        if (actuator == null)
            throw new GraphQLException($"Actuator with id {actuatorId} not found");
        bed.Modules.Add(actuator);
        await db.SaveChangesAsync();
        return actuator;
    }

    public async Task<bool> RemoveActuatorFromBed([ID] Guid bedId, [ID] Guid actuatorId,
                                                  [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        var actuator = await db.Get<ModuleRef>().FirstOrDefaultAsync(a => a.Id == actuatorId);
        if (actuator == null)
            throw new GraphQLException($"Actuator with id {actuatorId} not found");
        bed.Modules.Remove(actuator);
        await db.SaveChangesAsync();
        return true;
    }
}