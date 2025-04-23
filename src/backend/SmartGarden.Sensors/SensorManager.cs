using System.Collections.Concurrent;
using Microsoft.Extensions.DependencyInjection;
using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Connectors;

namespace SmartGarden.Sensors
{
    public class SensorManager(IServiceProvider sp) : ISensorManager
    {
        private readonly BlockingCollection<ISensorConnector> _connectors = new();

        public async Task<ISensorConnector> GetConnectorAsync(string key, SensorType type)
        { 
            var connector = _connectors.FirstOrDefault(x => x.Key == key && x.Type == type);

            if(connector == null)
            {
                connector = CreateConnector(key, type);
                await connector.InitializeAsync();
                _connectors.Add(connector);
            }

            return connector;
        }

        protected ISensorConnector CreateConnector(string key, SensorType type)
            => type switch
            {
                SensorType.Temperature => ActivatorUtilities.CreateInstance<TemperatureSensorConnector>(sp, key),       
                SensorType.Humidity=> ActivatorUtilities.CreateInstance<HumiditySensorConnector>(sp, key),
                // TODO add more
                _ => throw new SensorTypeNotFoundException(type)
            };
    }
}
