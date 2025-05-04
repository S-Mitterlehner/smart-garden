using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.Modules.Sensors;

public interface ISensorListener
{
    public Task PublishMeasurementAsync(SensorData data);
}