using LinqKit;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Dtos.Sensor;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.GraphQL;

public partial class Mutation
{
    [Obsolete("Use Module instead")]
    public async Task<SensorRefDto> AddSensorToBed([ID] Guid bedId, [ID] Guid sensorId,
                                                [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        if (bed.Modules.Any(s => s.Id == sensorId))
            throw new GraphQLException("Sensor already added to this bed");
        var sensor = await db.Get<ModuleRef>().FirstOrDefaultAsync(s => s.Id == sensorId);
        if (sensor == null)
            throw new GraphQLException($"Sensor with id {sensorId} not found");
        bed.Modules.Add(sensor);
        await db.SaveChangesAsync();
        return SensorRefDto.FromEntity.Invoke(sensor);
    }

    [Obsolete("Use Module instead")]
    public async Task<bool> RemoveSensorFromBed([ID] Guid bedId, [ID] Guid sensorId,
                                                [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        var sensor = await db.Get<ModuleRef>().FirstOrDefaultAsync(s => s.Id == sensorId);
        if (sensor == null)
            throw new GraphQLException($"Sensor with id {sensorId} not found");
        bed.Modules.Remove(sensor);
        await db.SaveChangesAsync();
        return true;
    }

    [Obsolete("Use Module instead")]
    public async Task<SensorRefDto> UpdateSensorRef([ID] Guid id, string? name, string? description,
                                                    [Service] ApplicationDbContext db)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null)
            throw new GraphQLException($"Sensor with id {id} not found");
        if (name is not null) reference.Name = name;
        if (description is not null) reference.Description = description;
        await db.SaveChangesAsync();
        return SensorRefDto.FromEntity.Invoke(reference);
    }
}