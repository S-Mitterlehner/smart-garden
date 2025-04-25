using SmartGarden.Actuators;

namespace SmartGarden.API.Services;

public class ActuatorInitializer(IActuatorManager actuatorManager) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await actuatorManager.SetupRegisterListenerAsync();
    }
}