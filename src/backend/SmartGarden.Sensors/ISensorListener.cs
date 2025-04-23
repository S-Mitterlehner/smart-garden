using SmartGarden.Sensors.Models;

namespace SmartGarden.Sensors;

public interface ISensorListener
{
    public Task PublishMeasurementAsync(SensorData data);
}