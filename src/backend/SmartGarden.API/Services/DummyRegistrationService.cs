using Microsoft.EntityFrameworkCore;
using SmartGarden.Core.Enums;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Sensors;

namespace SmartGarden.API.Services;

/// <summary>
///     Dummy service to simulate the automatic "registration" of Sensors and Actuators
/// </summary>
/// <param name="sensorManager"></param>
public class DummyRegistrationService(IServiceProvider sp, ISensorManager sensorManager) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await using var scope = sp.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
        var sensors = await db.Get<SensorRef>().Where(x => x.ConnectorKey != null).ToListAsync(cancellationToken: stoppingToken);

        foreach (var sensorRef in sensors)
        {
            await sensorManager.GetConnectorAsync(sensorRef.ConnectorKey, sensorRef.Type);
        }
    }
}