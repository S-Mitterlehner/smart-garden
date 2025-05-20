using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Service.Connectors.Dummies;

public class DummyHumiditySensorConnector(string key, string topic, IModuleListener listener) 
    : DummyBaseSensorConnector(key, topic, listener)
{
    public override ModuleType Type => ModuleType.Humidity;
}