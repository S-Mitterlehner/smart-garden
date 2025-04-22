using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators;

public interface IActuatorManager
{
    IActuatorConnector GetConnector(string key, ActuatorType type);
}