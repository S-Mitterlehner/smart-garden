using SmartGarden.Modules.Sensors;

namespace SmartGarden.API.Services;

public class SensorInitializer(ISensorManager sensorManager) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await sensorManager.SetupRegisterListenerAsync();
    }
}