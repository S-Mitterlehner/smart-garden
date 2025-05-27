using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using Timer = System.Timers.Timer;

namespace SmartGarden.Modules.Service.Connectors.Dummies;

public abstract class DummyBaseModuleConnector(string key, string topic, IModuleListener listener) : IServiceModuleConnector
{
    protected ModuleState _lastState;

    public string Key => key;
    public string Topic => topic;
    public abstract ModuleType Type { get; }

    protected abstract ModuleState GetInitialState();

    public Task InitializeAsync()
    {
        _lastState = GetInitialState();

        var timer = new Timer(5000);
        timer.Elapsed += (sender, args) =>
        {
            listener.PublishStateChangeAsync(_lastState, GetActionsAsync().Result);
        };
        timer.AutoReset = true;
        timer.Enabled = true;
        return Task.CompletedTask;
    }

    public virtual async Task<ModuleAutomationConfig> GetAutomationConfigAsync() =>
        new ModuleAutomationConfig
        {
            ModuleType = Type
            , ModuleKey = Key
            , TsType = "number"
            , Min = _lastState.Min
            , Max = _lastState.Max
            , Unit = _lastState.Unit
            ,
        };

    public Task<ModuleState> GetStateAsync() => Task.FromResult(_lastState);

    public async Task ExecuteAsync(ActionExecution execution)
    {
        _lastState = GetStateAfterExecution(execution);
        await listener.PublishStateChangeAsync(_lastState, await GetActionsAsync());
    }

    public abstract Task<IEnumerable<ActionDefinition>> GetActionsAsync();

    protected abstract ModuleState GetStateAfterExecution(ActionExecution execution);
}