using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Sensors;

namespace SmartGarden.API;

public class GraphQLQuery
{
    [UseFiltering]
    public IEnumerable<BedDto> GetBeds(ApplicationContext db)
    {
        return db.Get<Bed>().Select(BedDto.FromEntity);
    }
    
    [UseFiltering]
    public IEnumerable<PlantDto> GetPlants(ApplicationContext db)
    {
        return db.Get<Plant>().Select(PlantDto.FromEntity);
    }

    public async Task<IEnumerable<SensorDto>> GetSensorById(ApplicationContext db, ISensorManager sm)
    {
        var references = await db.Get<SensorRef>().ToListAsync();
        return await Task.WhenAll(references.Select(async sensorRef =>
        {
            var connector = await sm.GetConnectorAsync(sensorRef);
            var data = await connector.GetDataAsync();

            return new SensorDto
            {
                Id = sensorRef.Id,
                Type = sensorRef.Type.ToString(),
                Key = sensorRef.ConnectorKey,
                CurrentValue = data.CurrentValue,
                Name = sensorRef.Name,
                Description = sensorRef.Description,
                Unit = data.Unit,
                MinValue = data.Min,
                MaxValue = data.Max
            };
        }));
    }
}