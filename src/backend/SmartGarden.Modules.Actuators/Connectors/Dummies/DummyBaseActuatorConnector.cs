using SmartGarden.Modules.Actuators.Models;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using Timer = System.Timers.Timer;

namespace SmartGarden.Modules.Actuators.Connectors.Dummies;

public abstract class DummyBaseActuatorConnector(string key, string topic, IActuatorListener listener) : IActuatorConnector
{
    protected ActuatorState _lastState;

    public string Key => key;
    public string Topic => topic;
    public abstract ActuatorType Type { get; }
    public abstract string Name { get; }
    public abstract string Description { get; }

    protected abstract ActuatorState InitialState { get; }

    public Task InitializeAsync()
    {
        _lastState = InitialState;

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
        new ModuleAutomationConfig<ActuatorType>
        {
            ModuleType = Type
            , ConnectorKey = Key
            , TsType = "number"
            , Min = _lastState.Min
            , Max = _lastState.Max
            , Unit = _lastState.Unit
            ,
        };

    public Task<ActuatorState> GetStateAsync() => Task.FromResult(_lastState);

    public async Task ExecuteAsync(ActionExecution execution)
    {
        _lastState = GetStateAfterExecution(execution);
        await listener.PublishStateChangeAsync(_lastState, await GetActionsAsync());
    }

    public abstract Task<IEnumerable<ActionDefinition>> GetActionsAsync();

    protected abstract ActuatorState GetStateAfterExecution(ActionExecution execution);
}