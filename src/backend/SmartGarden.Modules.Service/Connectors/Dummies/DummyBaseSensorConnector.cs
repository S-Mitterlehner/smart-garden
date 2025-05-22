using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using Timer = System.Timers.Timer;

namespace SmartGarden.Modules.Service.Connectors.Dummies;

public abstract class DummyBaseSensorConnector(string key, string topic, IModuleListener listener) : IServiceModuleConnector
{
    private Timer _timer;
    private ModuleState _lastData = null!;
    
    public string Topic => topic;
    public string Key => key;
    public abstract ModuleType Type { get; }


    protected virtual double Min { get; set; } = 0;
    protected virtual double Max { get; set; } = 100;
    protected virtual string Unit => "%";

    public virtual Task InitializeAsync()
    {
        _timer = new Timer(5000);
        _timer.Elapsed += async (sender, args) =>
        {
            _lastData = new ModuleState()
            {
                ModuleKey = this.Key,
                ModuleType = Type,
                CurrentValue = Math.Round(Random.Shared.NextDouble() * (Max - Min) + Min, 2),
                Min = Min,
                Max = Max,
                ConnectionState = ConnectionState.Connected,
                Unit = Unit,
                LastUpdate = DateTime.UtcNow
            };
            
            await listener.PublishStateChangeAsync(_lastData, await GetActionsAsync());
        };
        
        _timer.Start();
        return Task.CompletedTask;
    }


    public virtual Task<ModuleState> GetStateAsync() => Task.FromResult(_lastData);
    
    public Task<IEnumerable<ActionDefinition>> GetActionsAsync() => Task.FromResult((IEnumerable<ActionDefinition>)[]);
    public Task ExecuteAsync(ActionExecution execution) => throw new ArgumentException("Sensor modules do not support actions");
}