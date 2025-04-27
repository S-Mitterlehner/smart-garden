using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Sensors;

public interface ISensorManager : IModuleManager
{
    Task<ISensorConnector> GetConnectorAsync(SensorRef reference);
}