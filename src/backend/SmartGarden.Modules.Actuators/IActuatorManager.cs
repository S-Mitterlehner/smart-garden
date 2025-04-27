using SmartGarden.EntityFramework.Models;

namespace SmartGarden.Modules.Actuators;

public interface IActuatorManager : IModuleManager
{
    Task<IActuatorConnector> GetConnectorAsync(ActuatorRef reference);
}