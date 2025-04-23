using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Models;
using Timer = System.Timers.Timer;

namespace SmartGarden.Sensors.Connectors;

public class HumiditySensorConnector: ISensorConnector
{
    private readonly ISensorListener _listener;
    public string Key { get; }
    public string Name => "Humidity";
    public string Description => "Humidity sensor is a device that measures the humidity of the environment. It is often used in weather stations.";

    public HumiditySensorConnector(string key, ISensorListener listener)
    {
        Key = key;
        _listener = listener;

        var timer = new Timer(5000); // TODO: Make real implementation
        timer.Elapsed += (sender, args) =>
        {
            _listener.PublishMeasurementAsync(GetDataAsync().Result).Wait();
        };
        timer.AutoReset = true;
        timer.Start();
    }

    public async Task<SensorData> GetDataAsync() =>
        new()
        {
            CurrentValue = Math.Round(Random.Shared.NextDouble() * 100.0, 2)
            , Min = 0
            , Max = 100
            , ConnectionState = ConnectionState.Connected
            , SensorKey = Key
            , Unit = "%"
        };
}