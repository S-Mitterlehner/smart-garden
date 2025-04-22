using SmartGarden.Actuators.Connectors;
using SmartGarden.Actuators.Connectors.Dummies;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators;

public static class ActuatorManagerExtensions
{
    public static T GetConnector<T>(this IActuatorManager manager, string key)  where T : class, IActuatorConnector
    {
        ActuatorType type;

        if(typeof(T) == typeof(PumpActuatorConnector) || typeof(T) == typeof(DummyPumpActuatorConnector))
            type = ActuatorType.Pump;
        else if (typeof(T) == typeof(HatchActuatorConnector) || typeof(T) == typeof(DummyHatchActuatorConnector))
            type = ActuatorType.Hatch;
        else
            throw new ArgumentException($"Unknown actuator connector type: {typeof(T).Name}");

        return manager.GetConnector(key, type) as T;
    }
}