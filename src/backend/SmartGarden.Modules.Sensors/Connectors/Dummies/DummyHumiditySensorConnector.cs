using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Sensors.Connectors.Dummies;

public class DummyHumiditySensorConnector(string key, string topic, ISensorListener listener) 
    : BaseDummySensorConnector(key, topic, listener)
{
    public override SensorType Type => SensorType.Humidity;
    public override string Name => "Humidity";
    public override string Description => "Humidity sensor is a device that measures the humidity of the environment. It is often used in weather stations.";
}