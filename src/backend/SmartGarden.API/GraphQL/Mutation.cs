using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Enums;
using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.API.GraphQL;

public class Mutation
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
        [Service] ApplicationContext db, [Service] IActuatorManager actuatorManager)
    {
        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) return false;
    
        var connector = await actuatorManager.GetConnectorAsync(reference);
        var action = await connector.GetActionDefinitionByKeyAsync(actionKey);
        if (action == null) throw new GraphQLException("Action not found.");
    
        if (action.ActionType == ActionType.Value && value == null)
            throw new GraphQLException("This action requires a value.");
    
        var execution = new ActionExecution
        {
            Key = actionKey,
            Type = action.ActionType,
            Value = value
        };
    
        await connector.ExecuteAsync(execution);
        return true;
    }
    

    public async Task<ActuatorRef> AddActuatorToBed([ID] Guid bedId, [ID] Guid actuatorId,
        [Service] ApplicationContext db)
    {
        var bed = await db.Get<Bed>()
            .Include(b => b.Actuators)
            .FirstOrDefaultAsync(b => b.Id == bedId);
    
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
        var bed = await db.Get<Bed>()
            .Include(b => b.Actuators)
            .FirstOrDefaultAsync(b => b.Id == bedId);
    
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
    
        var actuator = await db.Get<ActuatorRef>().FirstOrDefaultAsync(a => a.Id == actuatorId);
        if (actuator == null)
            throw new GraphQLException($"Actuator with id {actuatorId} not found");
    
        bed.Actuators.Remove(actuator);
        await db.SaveChangesAsync();
        return true;
    }
    

    public async Task<SensorRef> AddSensorToBed([ID] Guid bedId, [ID] Guid sensorId,
        [Service] ApplicationContext db)
    {
        var bed = await db.Get<Bed>()
            .Include(b => b.Sensors)
            .FirstOrDefaultAsync(b => b.Id == bedId);
    
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
    
        if (bed.Sensors.Any(s => s.Id == sensorId))
            throw new GraphQLException("Sensor already added to this bed");
    
        var sensor = await db.Get<SensorRef>().FirstOrDefaultAsync(s => s.Id == sensorId);
        if (sensor == null)
            throw new GraphQLException($"Sensor with id {sensorId} not found");
    
        bed.Sensors.Add(sensor);
        await db.SaveChangesAsync();
        return sensor;
    }
    

    public async Task<bool> RemoveSensorFromBed([ID] Guid bedId, [ID] Guid sensorId,
        [Service] ApplicationContext db)
    {
        var bed = await db.Get<Bed>()
            .Include(b => b.Sensors)
            .FirstOrDefaultAsync(b => b.Id == bedId);
    
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
    
        var sensor = await db.Get<SensorRef>().FirstOrDefaultAsync(s => s.Id == sensorId);
        if (sensor == null)
            throw new GraphQLException($"Sensor with id {sensorId} not found");
    
        bed.Sensors.Remove(sensor);
        await db.SaveChangesAsync();
        return true;
    }
    

    public async Task<SensorRef> UpdateSensorRef([ID] Guid id, string? name, string? description,
        [Service] ApplicationContext db)
    {
        var reference = await db.Get<SensorRef>().FirstOrDefaultAsync(x => x.Id == id);
    
        if (reference == null)
            throw new GraphQLException($"Sensor with id {id} not found");
    
        if (name is not null) reference.Name = name;
        if (description is not null) reference.Description = description;
    
        await db.SaveChangesAsync();
        return reference;
    }
}