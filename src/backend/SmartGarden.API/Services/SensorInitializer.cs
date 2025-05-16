using SmartGarden.Modules.Sensors;

namespace SmartGarden.API.Services;

public class SensorInitializer(ISensorManager sensorManager, ILogger<SensorInitializer> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await sensorManager.SetupRegisterListenerAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during sensor initialization");
        }
    }
}
