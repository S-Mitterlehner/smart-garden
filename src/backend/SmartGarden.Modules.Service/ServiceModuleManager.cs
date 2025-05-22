using MQTTnet;
using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Service.Models;
using SmartGarden.Mqtt;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SmartGarden.ConnectorService.EntityFramework;
using SmartGarden.ConnectorService.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules.Service.Connectors;
using SmartGarden.Modules.Service.Connectors.Dummies;

namespace SmartGarden.Modules.Service;

public class ServiceModuleManager(IServiceProvider sp, ILogger<ServiceModuleManager> logger,
    IOptions<ModuleSettings> settings, IMessagingProducer producer)  : IServiceModuleManager
{
    public const string RegisterTopic = "smart-garden/register";
    private readonly ConcurrentDictionary<string, IServiceModuleConnector> _connectors = new();

    public async Task<IServiceModuleConnector> GetConnectorAsync(IModuleRef reference) 
        => GetConnectorFromList(reference.ModuleKey, reference.Type) ?? await CreateConnectorAsync(reference);

    public async Task SetupRegisterListenerAsync()
    {
        var mqttClient = sp.GetRequiredService<IMqttClient>();

        mqttClient.ApplicationMessageReceivedAsync += TryRegisterDevice;
        await mqttClient.SubscribeAsync(RegisterTopic);
    }
    
    private async Task TryRegisterDevice(MqttApplicationMessageReceivedEventArgs e)
    {
        if(e.ApplicationMessage.Topic != RegisterTopic || e.ApplicationMessage.Payload.Length <= 0) return;

        var data = e.Parse<MqttModuleRegisterData>();
        var key = data.ModuleKey;

        foreach (var topic in data.Topics)
        {
            try
            {
                if (!Enum.TryParse<ModuleType>(topic.Key, true, out var moduleType))
                {
                    logger.LogWarning("Module type {ModuleType} not found -> skipped", topic.Key);
                    continue;
                }

                var connector = GetConnectorFromList(key, moduleType);

                if (connector is not null) continue;

                await using var scope = sp.CreateAsyncScope();
                await using var db = scope.ServiceProvider.GetRequiredService<ConnectionServiceDbContext>();

                connector = CreateConnectorInstance(key, moduleType, topic.Value);
                _connectors.TryAdd(GetDictKey(key, moduleType), connector);

                var reference = await db.Get<ModuleRef>()
                                            .FirstOrDefaultAsync(x => x.ModuleKey == key && x.Type == moduleType);
                
                if (reference is null)
                {
                    reference = db.New<ModuleRef>();
                    reference.ModuleKey = connector.Key;
                    reference.Type = connector.Type;
                }
                reference.Topic = topic.Value;

                await db.SaveChangesAsync();


                var body = new RegisterModuleMessageBody
                {
                    ModuleId = reference.Id,
                    ModuleKey = connector.Key,
                    ModuleType = connector.Type
                };
                var msg = new RegisterModuleMessage(body);
                await producer.SendAsync(msg);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to register actuator {ActuatorKey} with topic {Topic}", key, topic.Value);
            }
        }
    }

    private IServiceModuleConnector? GetConnectorFromList(string key, ModuleType type) 
        => _connectors.GetValueOrDefault(GetDictKey(key, type));

    private async Task<IServiceModuleConnector> CreateConnectorAsync(IModuleRef reference)
    {
        var topic = ""; // TODO: Improve?
        if(reference is IModuleRefWithTopic t) 
            topic = t.Topic;

        var connector = CreateConnectorInstance(reference.ModuleKey, reference.Type, topic);

        _connectors.TryAdd(GetDictKey(reference.ModuleKey, reference.Type), connector);
        await connector.InitializeAsync();

        return connector;
    }

    private string GetDictKey(string key, ModuleType type) => $"{key}-{type}";

    private IServiceModuleConnector CreateConnectorInstance(string key, ModuleType type, string topic)
    {
        if (settings.Value.UseDummies)
            return type switch
            {
                ModuleType.Temperature => ActivatorUtilities.CreateInstance<DummyTemperatureSensorConnector>(sp, key, topic),
                ModuleType.Humidity => ActivatorUtilities.CreateInstance<DummyHumiditySensorConnector>(sp, key, topic),
                ModuleType.Moisture => ActivatorUtilities.CreateInstance<DummyMoistureSensorConnector>(sp, key, topic),
                ModuleType.Pump => ActivatorUtilities.CreateInstance<DummyPumpModuleConnector>(sp, key, topic),
                ModuleType.Hatch => ActivatorUtilities.CreateInstance<DummyHatchModuleConnector>(sp, key, topic),
                _ => throw new ModuleTypeNotFoundException(type)
            };
        
        return type switch
        {
            ModuleType.Temperature => ActivatorUtilities.CreateInstance<TemperatureServiceModuleConnector>(sp, key, topic),
            ModuleType.Humidity => ActivatorUtilities.CreateInstance<HumidityServiceModuleConnector>(sp, key, topic),
            ModuleType.Moisture => ActivatorUtilities.CreateInstance<MoistureServiceModuleConnector>(sp, key, topic),
            ModuleType.Pump => ActivatorUtilities.CreateInstance<PumpServiceModuleConnector>(sp, key, topic),
            ModuleType.Hatch => ActivatorUtilities.CreateInstance<HatchServiceModuleConnector>(sp, key, topic),
            _ => throw new ModuleTypeNotFoundException(type)
        };
    }
}