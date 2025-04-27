using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MQTTnet;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Actuators.Models;
using SmartGarden.Modules.Enums;
using SmartGarden.Mqtt;

namespace SmartGarden.Modules.Actuators;

public partial class ActuatorManager(IServiceProvider sp, ILogger<ActuatorManager> logger) : IActuatorManager
{
    public const string RegisterTopic = "smart-garden/register/actuator";
    private readonly ConcurrentDictionary<string, IActuatorConnector> _connectors = new();


    public async Task<IActuatorConnector> GetConnectorAsync(ActuatorRef reference) 
        => GetConnectorFromList(reference.ConnectorKey, reference.Type) ?? await CreateConnectorAsync(reference);

    public async Task SetupRegisterListenerAsync()
    {
        var mqttClient = sp.GetRequiredService<IMqttClient>();

        mqttClient.ApplicationMessageReceivedAsync += TryRegisterDevice;
        await mqttClient.SubscribeAsync(RegisterTopic);
    }
    
    private async Task TryRegisterDevice(MqttApplicationMessageReceivedEventArgs e)
    {
        if(e.ApplicationMessage.Topic != RegisterTopic || e.ApplicationMessage.Payload.Length <= 0) return;

        var data = e.Parse<MqttActuatorRegisterData>();
        var key = data.ActuatorKey;

        foreach (var topic in data.Topics)
        {
            if (!Enum.TryParse<ActuatorType>(topic.Key, true, out var actuatorType))
            {
                logger.LogWarning("Actuator type {ActuatorType} not found -> skipped", topic.Key);
                continue;
            }
                
            var connector = GetConnectorFromList(key, actuatorType);

            if (connector is not null) return;
                
            await using var scope = sp.CreateAsyncScope();
            await using var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();

            connector = CreateConnectorInstance(key, actuatorType, topic.Value);
            _connectors.TryAdd(GetDictKey(key, actuatorType), connector);

            var reference = await db.Get<ActuatorRef>()
                                    .FirstOrDefaultAsync(x => x.ConnectorKey == key && x.Type == actuatorType);

            if (reference is null)
            {
                reference = db.New<ActuatorRef>();
                reference.Name = connector.Name;
                reference.Description = connector.Description;
                reference.ConnectorKey = connector.Key;
                reference.Type = connector.Type;
            }

            reference.Topic = topic.Value;

            await db.SaveChangesAsync();
        }
    }

    private IActuatorConnector? GetConnectorFromList(string key, ActuatorType type) 
        => _connectors.GetValueOrDefault(GetDictKey(key, type));

    private async Task<IActuatorConnector> CreateConnectorAsync(ActuatorRef reference)
    {
        var connector = CreateConnectorInstance(reference.ConnectorKey, reference.Type, reference.Topic);

        _connectors.TryAdd(GetDictKey(reference.ConnectorKey, reference.Type), connector);
        await connector.InitializeAsync();

        return connector;
    }

    private string GetDictKey(string key, ActuatorType type) => $"{key}-{type}";
}