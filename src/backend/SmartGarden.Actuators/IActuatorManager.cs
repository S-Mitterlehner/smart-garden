using SmartGarden.Core.Enums;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.Actuators;

public interface IActuatorManager
{
    Task<IActuatorConnector> GetConnectorAsync(ActuatorRef reference);
    Task SetupRegisterListenerAsync();
}