using Microsoft.Extensions.DependencyInjection;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Sensors.Connectors;

namespace SmartGarden.Modules.Sensors;

public partial class SensorManager
{
    private ISensorConnector CreateConnectorInstance(string key, SensorType type, string topic) =>
        type switch
        {
            SensorType.Temperature => ActivatorUtilities.CreateInstance<TemperatureSensorConnector>(sp, key, topic), SensorType.Humidity => ActivatorUtilities.CreateInstance<HumiditySensorConnector>(sp, key, topic),
            // TODO add more
            _ => throw new SensorTypeNotFoundException(type)
        };
}