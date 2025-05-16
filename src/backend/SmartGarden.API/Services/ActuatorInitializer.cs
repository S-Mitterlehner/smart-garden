using SmartGarden.Modules.Actuators;

namespace SmartGarden.API.Services;

public class ActuatorInitializer(IActuatorManager actuatorManager, ILogger<ActuatorInitializer> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await actuatorManager.SetupRegisterListenerAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during actuator initialization");
        }
    }
}