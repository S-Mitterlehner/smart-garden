using SmartGarden.Modules.Actuators;

namespace SmartGarden.API.Services;

public class ActuatorInitializer(IActuatorManager actuatorManager) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await actuatorManager.SetupRegisterListenerAsync();
    }
}