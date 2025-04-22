using System.Collections.Concurrent;
using SmartGarden.Actuators.Connectors;
using SmartGarden.Actuators.Connectors.Dummies;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators;

public class ActuatorManager(IServiceProvider sp) : IActuatorManager
{
    private readonly BlockingCollection<IActuatorConnector> _connectors = new();

    public IActuatorConnector GetConnector(string key, ActuatorType type)
    {
        var connector = _connectors.FirstOrDefault(x => x.Key == key);
        if(connector == null)
        {
            connector = CreateConnector(key, type);
            _connectors.Add(connector);
        }

        return connector;
    }

    protected IActuatorConnector CreateConnector(string key, ActuatorType type)
        => type switch
        {
            // TODO: activate real connectors
            ActuatorType.Pump => DummyPumpActuatorConnector.Create(key, sp), // PumpActuatorConnector.Create(key, sp)
            ActuatorType.Hatch => DummyHatchActuatorConnector.Create(key, sp), // HatchActuatorConnector.Create(key, sp)
            // TODO add more
            _ => throw new ActuatorTypeNotFoundException(type)
        };
}