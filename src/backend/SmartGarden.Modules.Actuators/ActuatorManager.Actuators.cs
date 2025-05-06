using Microsoft.Extensions.DependencyInjection;
using SmartGarden.Modules.Actuators.Connectors;
using SmartGarden.Modules.Actuators.Connectors.Dummies;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Actuators;

public partial class ActuatorManager
{
    private IActuatorConnector CreateConnectorInstance(string key, ActuatorType type, string topic) =>
        type switch
        {
            ActuatorType.Pump => ActivatorUtilities.CreateInstance<PumpActuatorConnector>(sp, key, topic),
            // TODO: activate real connector
            ActuatorType.Hatch => ActivatorUtilities.CreateInstance<HatchActuatorConnector>(sp, key, topic),
            // HatchActuatorConnector.Create(key, sp)
            // TODO add more
            _ => throw new ActuatorTypeNotFoundException(type)
        };
}