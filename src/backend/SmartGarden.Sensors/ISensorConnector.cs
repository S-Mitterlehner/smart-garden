using SmartGarden.Sensors.Models;

namespace SmartGarden.Sensors;

public interface ISensorConnector
{
    string Key { get; }
    string Name { get; }
    string Description { get; }

    Task<SensorData> GetDataAsync();
}