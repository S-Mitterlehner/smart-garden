using System.Collections.Concurrent;
using Microsoft.Extensions.DependencyInjection;
using MQTTnet;
using SmartGarden.Core.Enums;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Mqtt;
using SmartGarden.Sensors.Connectors;
using SmartGarden.Sensors.Models;

namespace SmartGarden.Sensors
{
    public class SensorManager(IServiceProvider sp) : ISensorManager
    {
        public const string RegisterTopic = "smart-garden/register/sensor";

        private readonly BlockingCollection<ISensorConnector> _connectors = new();

        public async Task<ISensorConnector> GetConnectorAsync(string key, SensorType type) 
            => GetConnectorFromList(key, type) ?? await CreateConnectorAsync(key, type);

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
            var type = Enum.Parse<SensorType>(data.SensorType);
            var connector = GetConnectorFromList(key, type);

            if (connector is not null) return;
            connector = CreateConnectorInstance(key, type);

            await using var scope = sp.CreateAsyncScope();
            await using var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();

            var reference = db.New<SensorRef>();
            reference.Name = connector.Name;
            reference.Description = connector.Description;
            reference.ConnectorKey = connector.Key;
            reference.Type = connector.Type;

            await db.SaveChangesAsync();
        }

        private ISensorConnector? GetConnectorFromList(string key, SensorType type) 
            => _connectors.FirstOrDefault(x => x.Key == key && x.Type == type) ;

        private async Task<ISensorConnector> CreateConnectorAsync(string key, SensorType type)
        {
            var connector = CreateConnectorInstance(key, type);

            await connector.InitializeAsync();
            _connectors.Add(connector);

            return connector;
        }

        private ISensorConnector CreateConnectorInstance(string key, SensorType type)
            => type switch
            {
                SensorType.Temperature => ActivatorUtilities.CreateInstance<TemperatureSensorConnector>(sp, key),       
                SensorType.Humidity=> ActivatorUtilities.CreateInstance<HumiditySensorConnector>(sp, key),
                // TODO add more
                _ => throw new SensorTypeNotFoundException(type)
            };
    }
}
