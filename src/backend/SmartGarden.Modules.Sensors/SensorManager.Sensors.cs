using Microsoft.Extensions.DependencyInjection;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Sensors.Connectors;
using SmartGarden.Modules.Sensors.Connectors.Dummies;

namespace SmartGarden.Modules.Sensors;

public partial class SensorManager
{
    private ISensorConnector CreateConnectorInstance(string key, SensorType type, string topic)
    {
        if (settings.Value.UseDummies)
            return type switch
            {
                SensorType.Temperature => ActivatorUtilities.CreateInstance<DummyTemperatureSensorConnector>(sp, key,
                    topic),
                SensorType.Humidity => ActivatorUtilities.CreateInstance<DummyHumiditySensorConnector>(sp, key, topic),
                SensorType.Moisture => ActivatorUtilities.CreateInstance<DummyMoistureSensorConnector>(sp, key, topic),
                _ => throw new SensorTypeNotFoundException(type)
            };
        
        return type switch
        {
            SensorType.Temperature => ActivatorUtilities.CreateInstance<TemperatureSensorConnector>(sp, key, topic),
            SensorType.Humidity => ActivatorUtilities.CreateInstance<HumiditySensorConnector>(sp, key, topic),
            SensorType.Moisture => ActivatorUtilities.CreateInstance<MoistureSensorConnector>(sp, key, topic),
            // TODO add more
            _ => throw new SensorTypeNotFoundException(type)
        };
    }
}