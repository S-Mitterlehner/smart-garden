using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.GraphQL;

public partial class Mutation
{
    public async Task<SensorRef> AddSensorToBed([ID] Guid bedId, [ID] Guid sensorId,
                                                [Service] ApplicationContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
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
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
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