using System.Text.Json;
using MQTTnet;
using MQTTnet.Protocol;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Service.Models;
using SmartGarden.Mqtt;

namespace SmartGarden.Modules.Service;

public abstract class BaseServiceModuleConnector(string key, string topic, IMqttClient mqttClient, IModuleListener listener) : IServiceModuleConnector
{
    protected ModuleState _lastState;

    public string Key => key;
    public abstract ModuleType Type { get; }
    public string Topic => topic;

    public abstract Task<IEnumerable<ActionDefinition>> GetActionsAsync();
    protected abstract ModuleState GetInitialState();
    public abstract Task ExecuteAsync(ActionExecution execution);

    public Task UpdateStateAsync(ModuleState state) 
    {
        _lastState = state;
        return Task.CompletedTask;
    }

    public virtual Task<ModuleState> GetStateAsync() => Task.FromResult(_lastState);

    public virtual async Task InitializeAsync()
    {
        mqttClient.ApplicationMessageReceivedAsync += OnMqttClientOnApplicationMessageReceivedAsync;
        await mqttClient.SubscribeAsync(Topic);
        _lastState = GetInitialState();
    }

    protected async Task OnMqttClientOnApplicationMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs e)
    {
        try
        {
            if (e.ApplicationMessage.Topic != Topic) return; // Ignore messages not for this topic

            var data = e.Parse<MqttState>();

            if (data is null || data.MessageType != MqttMessage.STATE_MESSAGE_TYPE) return; // Ignore messages which aren't state messages

            var state = GetStateFromMqtt(data);
            await listener.PublishStateChangeAsync(state, await GetActionsAsync());
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error parsing MQTT message: " + ex.Message); // TODO: call logger
        }
    }

    protected ModuleState GetStateFromMqtt(MqttState? data)
    {
        if(!Enum.TryParse(data?.StateType, out StateType stateType))
            throw new ArgumentOutOfRangeException(nameof(data), "StateType not found");

        switch (stateType)
        {
            case StateType.Discrete:
                return new ModuleState
                {
                    State = data.State, 
                    StateType = StateType.Discrete, 
                    ModuleKey = Key,
                    ModuleType = Type,
                    ConnectionState = ConnectionState.Connected,
                    LastUpdate = DateTime.UtcNow
                };
            case StateType.Continuous:
                return new ModuleState
                {
                    CurrentValue = data.CurrentValue,
                    Min = data.Min,
                    Max = data.Max,
                    Unit = data.Unit,
                    StateType = StateType.Continuous, 
                    ModuleKey = Key,
                    ModuleType = Type,
                    ConnectionState = ConnectionState.Connected,
                    LastUpdate = DateTime.UtcNow
                };
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(stateType), stateType, null);
        }
    }

    protected MqttActionExecution GetMqttActionFromExecution(ActionExecution data)
    {
        if (data is null) throw new ArgumentNullException(nameof(data));
        return new MqttActionExecution
        {
            ActionKey = data.ActionKey,
            ModuleKey = Key,
            ModuleType = Type.ToString(),
            Value = data.Value,
            Type = data.Type.ToString()
        };
    }

}

public abstract class BaseSensorServiceModuleConnector(string key, string topic, IMqttClient mqtt, IModuleListener listener) : BaseServiceModuleConnector(key, topic, mqtt, listener)
{
    public override Task<IEnumerable<ActionDefinition>> GetActionsAsync() => Task.FromResult((IEnumerable<ActionDefinition>)[]);
    public override Task ExecuteAsync(ActionExecution execution) => throw new ArgumentException("Sensor modules do not support actions");
}

public abstract class BaseActuatorServiceModuleConnector(string key, string topic, IMqttClient mqttClient, IModuleListener listener) : BaseServiceModuleConnector(key, topic, mqttClient, listener)
{
    public override async Task ExecuteAsync(ActionExecution execution)
    {
        var actions = await GetActionsAsync();
        var currentAction = actions.FirstOrDefault(a => a.ActionKey == execution.ActionKey);

        if (currentAction is null)
            throw new ArgumentOutOfRangeException(nameof(execution), "Action not found for this Actuator");

        if (!currentAction.IsAllowed)
            throw new InvalidOperationException("Action not allowed for this Actuator");

        var message = GetMqttActionFromExecution(execution);

        var appMessage = new MqttApplicationMessageBuilder()
                         .WithTopic(Topic)
                         .WithPayload(JsonSerializer.Serialize(message))
                         .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce)
                         .Build();

        await mqttClient.PublishAsync(appMessage);
    }
}