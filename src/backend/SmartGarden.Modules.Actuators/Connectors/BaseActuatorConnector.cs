using System.Text.Json;
using MQTTnet;
using MQTTnet.Protocol;
using SmartGarden.Modules.Actuators.Enums;
using SmartGarden.Modules.Actuators.Models;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using SmartGarden.Mqtt;

namespace SmartGarden.Modules.Actuators.Connectors;

public abstract class BaseActuatorConnector(string key, string topic, IMqttClient mqttClient, IActuatorListener listener) : IActuatorConnector
{
    protected ActuatorState _lastState;

    public string Key => key;
    public string Topic => topic;

    public abstract ActuatorType Type { get; }

    public abstract string Name { get; }
    public abstract string Description { get; }
    protected abstract ActuatorState InitialState { get; }


    public abstract Task<IEnumerable<ActionDefinition>> GetActionsAsync();


    public async Task InitializeAsync()
    {
        _lastState = InitialState;

        mqttClient.ApplicationMessageReceivedAsync += OnMqttClientOnApplicationMessageReceivedAsync;
        await mqttClient.SubscribeAsync(Topic);
    }

    public abstract Task<ModuleAutomationConfig> GetAutomationConfigAsync();

    public async Task<ActuatorState> GetStateAsync() => _lastState;

    public virtual async Task ExecuteAsync(ActionExecution execution)
    {
        var actions = await GetActionsAsync();
        var currentAction = actions.FirstOrDefault(a => a.Key == execution.Key);

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

    protected async Task OnMqttClientOnApplicationMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs e)
    {
        try
        {
            if (e.ApplicationMessage.Topic != Topic) return; // Ignore messages not for this topic

            var data = e.Parse<MqttActuatorState>();

            if (data is null || data.MessageType != MqttActuatorMessage.STATE_MESSAGE_TYPE) return; // Ignore messages which aren't state messages

            _lastState = GetStateFromMqtt(data);
            await listener.PublishStateChangeAsync(_lastState, await GetActionsAsync());
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error parsing MQTT message: " + ex.Message);
        }
    }

    protected ActuatorState GetStateFromMqtt(MqttActuatorState? data)
    {
        if(!Enum.TryParse(data?.StateType, out StateType stateType))
            throw new ArgumentOutOfRangeException(nameof(data), "StateType not found");

        switch (stateType)
        {
            case StateType.Discrete:
                return new ActuatorState
                {
                    State = data.State, 
                    StateType = StateType.Discrete, 
                    ActuatorKey = Key,
                    ActuatorType = Type,
                    ConnectionState = ConnectionState.Connected,
                    LastUpdate = DateTime.UtcNow
                };
            case StateType.Continuous:
                return new ActuatorState
                {
                    CurrentValue = data.CurrentValue,
                    Min = data.Min,
                    Max = data.Max,
                    Unit = data.Unit,
                    StateType = StateType.Continuous, 
                    ActuatorKey = Key,
                    ActuatorType = Type,
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
            ActionKey = data.Key,
            ActuatorKey = Key,
            ActuatorType = Type.ToString(),
            Value = data.Value,
            Type = data.Type.ToString()
        };
    }
}