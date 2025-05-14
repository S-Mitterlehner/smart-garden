using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Sensors.Connectors.Dummies;

public class DummyTemperatureSensorConnector(string key, string topic, ISensorListener listener) 
    : BaseDummySensorConnector(key, topic, listener)
{    
    public override string Name => "Temperature";
    public override string Description => "Temperature sensor is a device that measures the temperature of the environment. It is often used in weather stations.";
    public override SensorType Type => SensorType.Temperature;
}