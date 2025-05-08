using SmartGarden.API.Dtos.Sensor;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Sensors;

namespace SmartGarden.API.GraphQL;

[ExtendObjectType(typeof(Query))]
public class SensorQueries
{
    [UseFiltering]
    public async Task<IEnumerable<SensorDto>> GetSensors(ApplicationContext db, ISensorManager sensorManager)
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
}