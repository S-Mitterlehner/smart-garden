using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Sensors.Models;
using Timer = System.Timers.Timer;

namespace SmartGarden.Modules.Sensors.Connectors.Dummies;

public abstract class BaseDummySensorConnector(string key, string topic, ISensorListener listener) : ISensorConnector
{
    private Timer _timer;
    private SensorData _lastData = null!;
    
    public string Topic => topic;
    public string Key => key;
    
    public abstract string Name { get; }
    public abstract string Description { get; }
    public abstract SensorType Type { get; }

    protected virtual double Min { get; set; } = 0;
    protected virtual double Max { get; set; } = 100;
    protected virtual string Unit => "%";

    public virtual Task InitializeAsync()
    {
        _timer = new Timer(5000);
        _timer.Elapsed += (sender, args) =>
        {
            _lastData = new SensorData
            {
                SensorKey = this.Key,
                SensorType = Type,
                CurrentValue = Math.Round(Random.Shared.NextDouble() * (Max - Min) + Min, 2),
                Min = Min,
                Max = Max,
                ConnectionState = ConnectionState.Connected,
                Unit = Unit,
                LastUpdate = DateTime.UtcNow
            };
            
            listener.PublishMeasurementAsync(_lastData);
        };
        
        _timer.Start();
        return Task.CompletedTask;
    }

    public virtual Task<SensorData> GetDataAsync()
    {
        return Task.FromResult(_lastData);
    }

    public virtual async Task<ModuleAutomationConfig> GetAutomationConfigAsync()
    {
        var state = await GetDataAsync();

        return new ModuleAutomationConfig<SensorType>
        {
            ConnectorKey = Key,
            ModuleType = Type,
            Min = state.Min,
            Max = state.Max,
            Unit = state.Unit,
            TsType = "number"
        };
    }
}