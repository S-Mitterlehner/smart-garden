using SmartGarden.EntityFramework.Models;

namespace SmartGarden.Modules.Sensors;

public interface ISensorManager : IModuleManager
{
    Task<ISensorConnector> GetConnectorAsync(SensorRef reference);
}