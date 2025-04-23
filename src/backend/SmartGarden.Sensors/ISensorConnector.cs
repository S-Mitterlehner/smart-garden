using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Models;

namespace SmartGarden.Sensors;

public interface ISensorConnector
{
    string Key { get; }
    SensorType Type { get; }
    string Topic { get; }
    string Name { get; }
    string Description { get; }

    Task<SensorData> GetDataAsync();
}