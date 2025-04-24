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

public class SensorManager(IServiceProvider sp, ILogger<SensorManager> logger) : ISensorManager
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
        var data = e.Parse<MqttRegisterData>();
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

        await connector.InitializeAsync();
        _connectors.TryAdd(GetDictKey(reference.ConnectorKey, reference.Type), connector);

        return connector;
    }

    private ISensorConnector CreateConnectorInstance(string key, SensorType type, string topic)
        => type switch
        {
            SensorType.Temperature => ActivatorUtilities.CreateInstance<TemperatureSensorConnector>(sp, key, topic),       
            SensorType.Humidity=> ActivatorUtilities.CreateInstance<HumiditySensorConnector>(sp, key, topic),
            // TODO add more
            _ => throw new SensorTypeNotFoundException(type)
        };

    private string GetDictKey(string key, SensorType type) => $"{key}-{type}";
}