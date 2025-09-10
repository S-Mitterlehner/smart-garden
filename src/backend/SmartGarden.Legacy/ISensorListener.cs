namespace SmartGarden.Legacy;

[Obsolete("Please change implementation accordingly")]
public interface ISensorListener
{
    public Task PublishMeasurementAsync(SensorData data);
}