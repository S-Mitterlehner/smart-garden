using SmartGarden.Core.Enums;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.Sensors;

public interface ISensorManager
{
    Task<ISensorConnector> GetConnectorAsync(SensorRef reference);
    Task SetupRegisterListenerAsync();
}