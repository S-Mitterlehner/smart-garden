using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;
using ActionType = SmartGarden.Modules.Actuators.Enums.ActionType;

namespace SmartGarden.API.GraphQL;

public partial class Mutation
{
    public async Task<ActuatorRef?> UpdateActuatorRef([ID] Guid id, string? name, string? description,
                                                      [Service] ApplicationContext db)
    {
        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) throw new GraphQLException("Actuator not found.");
        if (name is not null) reference.Name = name;
        if (description is not null) reference.Description = description;
        await db.SaveChangesAsync();
        return reference;
    }

    public async Task<bool> ExecuteActuatorAction([ID] Guid id, string actionKey, double? value,
                                                  [Service] ApplicationContext db, 
                                                  [Service] IActuatorManager actuatorManager,
                                                  [Service] IMessagingProducer messaging)
    {
        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == id);
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

    public async Task<ActuatorRef> AddActuatorToBed([ID] Guid bedId, [ID] Guid actuatorId,
                                                    [Service] ApplicationContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        if (bed.Actuators.Any(a => a.Id == actuatorId))
            throw new GraphQLException("Actuator already added to this bed");
        var actuator = await db.Get<ActuatorRef>().FirstOrDefaultAsync(a => a.Id == actuatorId);
        if (actuator == null)
            throw new GraphQLException($"Actuator with id {actuatorId} not found");
        bed.Actuators.Add(actuator);
        await db.SaveChangesAsync();
        return actuator;
    }

    public async Task<bool> RemoveActuatorFromBed([ID] Guid bedId, [ID] Guid actuatorId,
                                                  [Service] ApplicationContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        var actuator = await db.Get<ActuatorRef>().FirstOrDefaultAsync(a => a.Id == actuatorId);
        if (actuator == null)
            throw new GraphQLException($"Actuator with id {actuatorId} not found");
        bed.Actuators.Remove(actuator);
        await db.SaveChangesAsync();
        return true;
    }
}