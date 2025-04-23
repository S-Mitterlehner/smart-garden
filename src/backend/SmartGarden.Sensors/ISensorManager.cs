using SmartGarden.Core.Enums;

namespace SmartGarden.Sensors;

public interface ISensorManager
{
    Task<ISensorConnector> GetConnectorAsync(string key, SensorType type);
    Task SetupRegisterListenerAsync();
}