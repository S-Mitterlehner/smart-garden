using SmartGarden.Modules;

namespace SmartGarden.API.Services;

public class SensorInitializer(IServiceModuleManager moduleManager, ILogger<SensorInitializer> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await moduleManager.SetupRegisterListenerAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during sensor initialization");
        }
    }
}
