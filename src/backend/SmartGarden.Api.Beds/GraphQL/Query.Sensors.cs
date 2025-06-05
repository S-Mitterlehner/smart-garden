using LinqKit;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Dtos.Sensor;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;
using SmartGarden.Modules.Api;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Api.Beds.GraphQL;

public partial class Query
{
    [UseFiltering]
    [Obsolete("Use GetModule instead")]
    public async Task<IEnumerable<SensorRefDto>> GetSensors([Service] ApplicationDbContext db)
        => await db.Get<ModuleRef>()
            .Where(x => ModuleTypeExpressions.IsSensor.Invoke(x.Type))
            .Select(SensorRefDto.FromEntity)
            .ToListAsync();

    [UseFiltering]
    [Obsolete("Use GetModule instead")]
    public async Task<IEnumerable<SensorDto>> GetSensors(
        [Service] ApplicationDbContext db, [Service] IApiModuleManager moduleManager)
    {
        var references = db.Get<ModuleRef>().Where(x => ModuleTypeExpressions.IsSensor.Invoke(x.Type)).ToList();
        var sensorTasks = references.Select(async r =>
        {
            var connector = await moduleManager.GetConnectorAsync(r);
            var data = await connector.GetStateAsync();
            return new SensorDto
            {
                Id = r.Id
                , Name = r.Name
                , Key = r.ModuleKey
                , Description = r.Description
                , Unit = data.Unit
                , MaxValue = data.Max
                , MinValue = data.Min
                , CurrentValue = data.CurrentValue
                , Type = r.Type
            };
        });
        var sensors = await Task.WhenAll(sensorTasks);
        return sensors;
    }

    [UseFiltering]
    [Obsolete("Use GetModule instead")]
    public async Task<SensorDto?> GetSensor(Guid id,
                                            [Service] ApplicationDbContext db, [Service] IApiModuleManager moduleManager)
    {
        var sensor = (await GetSensors(db, moduleManager)).FirstOrDefault(x => x.Id == id);
        return sensor;
    }
}