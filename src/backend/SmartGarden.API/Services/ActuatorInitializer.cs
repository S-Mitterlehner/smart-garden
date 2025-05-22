using SmartGarden.Modules;
using SmartGarden.Modules.Actuators;

namespace SmartGarden.API.Services;

public class ActuatorInitializer(IServiceModuleManager moduleManager, ILogger<ActuatorInitializer> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await moduleManager.SetupRegisterListenerAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during actuator initialization");
        }
    }
}