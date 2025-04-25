using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MQTTnet;
using SmartGarden.Core.Enums;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Mqtt;
using SmartGarden.Sensors.Connectors;
using SmartGarden.Sensors.Models;

namespace SmartGarden.Sensors;

public partial class SensorManager(IServiceProvider sp, ILogger<SensorManager> logger) : ISensorManager
{
    public const string RegisterTopic = "smart-garden/register/sensor";

    private readonly ConcurrentDictionary<string, ISensorConnector> _connectors = new();

    public async Task<ISensorConnector> GetConnectorAsync(SensorRef reference) 
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

        var data = e.Parse<MqttSensorRegisterData>();
        var key = data.SensorKey;

        foreach (var topic in data.Topics)
        {
            if (!Enum.TryParse<SensorType>(topic.Key, true, out var sensorType))
            {
                logger.LogWarning("Sensor type {SensorType} not found -> skipped", topic.Key);
                continue;
            }
                
            var connector = GetConnectorFromList(key, sensorType);

            if (connector is not null) return;
                
            await using var scope = sp.CreateAsyncScope();
            await using var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();

            connector = CreateConnectorInstance(key, sensorType, topic.Value);
            _connectors.TryAdd(GetDictKey(key, sensorType), connector);

            var reference = await db.Get<SensorRef>()
                .FirstOrDefaultAsync(x => x.ConnectorKey == key && x.Type == sensorType);

            if (reference is null)
            {
                reference = db.New<SensorRef>();
                reference.Name = connector.Name;
                reference.Description = connector.Description;
                reference.ConnectorKey = connector.Key;
                reference.Type = connector.Type;
            }

            reference.Topic = topic.Value;

            await db.SaveChangesAsync();
        }
    }

    private ISensorConnector? GetConnectorFromList(string key, SensorType type) 
        => _connectors.GetValueOrDefault(GetDictKey(key, type));

    private async Task<ISensorConnector> CreateConnectorAsync(SensorRef reference)
    {
        var connector = CreateConnectorInstance(reference.ConnectorKey, reference.Type, reference.Topic);

        _connectors.TryAdd(GetDictKey(reference.ConnectorKey, reference.Type), connector);
        await connector.InitializeAsync();

        return connector;
    }

    private string GetDictKey(string key, SensorType type) => $"{key}-{type}";
}