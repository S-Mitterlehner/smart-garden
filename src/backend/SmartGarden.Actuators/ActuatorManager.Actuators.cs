using Microsoft.Extensions.DependencyInjection;
using SmartGarden.Actuators.Connectors;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators;

public partial class ActuatorManager
{
    private IActuatorConnector CreateConnectorInstance(string key, ActuatorType type, string topic) =>
        type switch
        {
            ActuatorType.Pump => ActivatorUtilities.CreateInstance<PumpActuatorConnector>(sp, key, topic),
            // TODO: activate real connector
            ActuatorType.Hatch => ActivatorUtilities.CreateInstance<DummyHatchActuatorConnector>(sp, key, topic), // HatchActuatorConnector.Create(key, sp)
            // TODO add more
            _ => throw new ActuatorTypeNotFoundException(type)
        };
}