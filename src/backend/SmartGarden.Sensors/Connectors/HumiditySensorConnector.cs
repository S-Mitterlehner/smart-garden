using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Models;

namespace SmartGarden.Sensors.Connectors;

public class HumiditySensorConnector(string key) : ISensorConnector
{
    public string Key => key;
    public string Name => "Humidity";
    public string Description => "Humidity sensor is a device that measures the humidity of the environment. It is often used in weather stations.";
    public async Task<SensorData> GetDataAsync() =>
        new()
        {
            CurrentValue = Math.Round(Random.Shared.NextDouble() * 100.0, 2)
            , Min = 0
            , Max = 100
            , ConnectionState = ConnectionState.Connected
            , SensorKey = key
            , Unit = "%"
        };
}