using System.Collections.Concurrent;
using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Connectors;

namespace SmartGarden.Sensors
{
    public class SensorManager : ISensorManager
    {
        private readonly BlockingCollection<ISensorConnector> _connectors = new();

        public ISensorConnector GetConnector(string key, SensorType type)
        { 
            var connector = _connectors.FirstOrDefault(x => x.Key == key);
            if(connector == null)
            {
                connector = CreateConnector(key, type);
                _connectors.Add(connector);
            }

            return connector;
        }

        
        protected ISensorConnector CreateConnector(string key, SensorType type)
            => type switch
            {
                SensorType.Temperature => new TemperatureSensorConnector(key),         
                SensorType.Humidity=> new HumiditySensorConnector(key),
                // TODO add more
                _ => throw new SensorTypeNotFoundException(type)
            };
    }
}
