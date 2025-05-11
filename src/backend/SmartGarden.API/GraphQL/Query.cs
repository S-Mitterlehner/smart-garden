using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Sensors;

namespace SmartGarden.API.GraphQL;

// https://localhost:5002/graphql/
// https://chillicream.com/docs/hotchocolate/v15/defining-a-schema/queries
// https://chillicream.com/docs/hotchocolate/v11/integrations/entity-framework

public class Query
{
    [UseFiltering]
    public async Task<IEnumerable<ActuatorRefDto>> GetActuators([Service] ApplicationContext db)
        => await db.Get<ActuatorRef>().Select(ActuatorDto.FromEntity).ToListAsync();
    
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
            Id  = reference.Id,
            Name = reference.Name,
            Key = reference.ConnectorKey,
            Type = reference.Type.ToString(),
            Description = connector.Description,
            State = ActuatorStateDto.FromState(state, await connector.GetActionsAsync())
        };
    }
    
    [UseFiltering]
    public async Task<IEnumerable<BedDto>> GetBeds([Service] ApplicationContext db)
        => await db.Get<Bed>().Select(BedDto.FromEntity).ToListAsync();
    
    [UseFiltering]
    public async Task<BedDto?> GetBed(Guid id, [Service] ApplicationContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == id);
        if (bed == null) return null;
        return BedDto.FromEntity.Compile().Invoke(bed);
    }
    
    [UseFiltering]
    public async Task<IEnumerable<PlantDto>> GetPlants([Service] ApplicationContext db)
        => await db.Get<Plant>().Select(PlantDto.FromEntity).ToListAsync();
    
    [UseFiltering]
    public async Task<PlantDto?> GetPlant(Guid id, [Service] ApplicationContext db)
    {
        var plant = await db.Get<Plant>().FirstOrDefaultAsync(x => x.Id == id);        
        if (plant is null) return null;
        return PlantDto.FromEntity.Compile().Invoke(plant);
    }
    
    [UseFiltering]
    public async Task<IEnumerable<SensorRefDto>> GetSensors([Service] ApplicationContext db)
        => await db.Get<SensorRef>().Select(SensorRefDto.FromEntity).ToListAsync();
    
    [UseFiltering]
    public async Task<IEnumerable<SensorDto>> GetSensors(
        [Service] ApplicationContext db, [Service] ISensorManager sensorManager)
    {
        var references = db.Get<SensorRef>().ToList();
        var sensorTasks = references.Select(async r =>
        {
            var connector = await sensorManager.GetConnectorAsync(r);
            var data = await connector.GetDataAsync();
            return new SensorDto
            {
                Id = r.Id,
                Name = r.Name,
                Key = r.ConnectorKey,
                Description = r.Description,
                Unit = data.Unit,
                MaxValue = data.Max,
                MinValue = data.Min,
                CurrentValue = data.CurrentValue,
                Type = r.Type.ToString()
            };
        });

        var sensors = await Task.WhenAll(sensorTasks);
        return sensors;
    }
    
    [UseFiltering]
    public async Task<SensorDto?> GetSensor(Guid id,
        [Service] ApplicationContext db, [Service] ISensorManager sensorManager)
    {
        var sensor = (await GetSensors(db, sensorManager)).FirstOrDefault(x => x.Id == id);
        return sensor;
    }
}