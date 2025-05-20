using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.Modules.Sensors;

public interface ISensorConnector : IModuleConnector<SensorType>
{
    Task<SensorData> GetStateAsync();
}