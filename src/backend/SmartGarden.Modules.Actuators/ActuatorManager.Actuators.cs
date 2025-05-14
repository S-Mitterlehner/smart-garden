using Microsoft.Extensions.DependencyInjection;
using SmartGarden.Modules.Actuators.Connectors;
using SmartGarden.Modules.Actuators.Connectors.Dummies;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Actuators;

public partial class ActuatorManager
{
    private IActuatorConnector CreateConnectorInstance(string key, ActuatorType type, string topic)
    {
        if (settings.Value.UseDummies)
            return type switch
            {
                ActuatorType.Pump => ActivatorUtilities.CreateInstance<DummyPumpActuatorConnector>(sp, key, topic),
                ActuatorType.Hatch => ActivatorUtilities.CreateInstance<DummyHatchActuatorConnector>(sp, key, topic),
                _ => throw new ActuatorTypeNotFoundException(type)
            };
        
        return type switch
        {
            ActuatorType.Pump => ActivatorUtilities.CreateInstance<PumpActuatorConnector>(sp, key, topic),
            ActuatorType.Hatch => ActivatorUtilities.CreateInstance<HatchActuatorConnector>(sp, key, topic),
            _ => throw new ActuatorTypeNotFoundException(type)
        };
    }
}