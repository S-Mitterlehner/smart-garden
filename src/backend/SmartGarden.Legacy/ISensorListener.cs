using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.Modules.Sensors;

[Obsolete("Please change implementation accordingly")]
public interface ISensorListener
{
    public Task PublishMeasurementAsync(SensorData data);
}