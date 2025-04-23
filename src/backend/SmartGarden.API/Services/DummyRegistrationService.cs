using SmartGarden.Core.Enums;
using SmartGarden.Sensors;

namespace SmartGarden.API.Services;

/// <summary>
///     Dummy service to simulate the automatic "registration" of Sensors and Actuators
/// </summary>
/// <param name="sensorManager"></param>
public class DummyRegistrationService(ISensorManager sensorManager) : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        sensorManager.GetConnector("temp", SensorType.Temperature);
        sensorManager.GetConnector("hum", SensorType.Humidity);
        return Task.CompletedTask;
    }
}