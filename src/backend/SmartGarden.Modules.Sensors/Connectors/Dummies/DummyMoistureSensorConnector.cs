using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Sensors.Connectors.Dummies;

public class DummyMoistureSensorConnector(string key, string topic, ISensorListener listener) 
    : BaseDummySensorConnector(key, topic, listener)
{
    public override SensorType Type => SensorType.Moisture;
    public override string Name => "Moisture";
    public override string Description 
        => """
           Soil moisture sensor is a device that measures the water content in the soil.
           It is commonly used in gardening to monitor soil conditions.
           """;
}