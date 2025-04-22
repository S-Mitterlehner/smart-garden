using System.Collections.Concurrent;
using SmartGarden.Actuators.Connectors;
using SmartGarden.Actuators.Connectors.Dummies;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators;

public class ActuatorManager : IActuatorManager
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
            ActuatorType.Pump => new DummyPumpActuatorConnector(key), // new PumpActuatorConnector(key),
            ActuatorType.Hatch => new DummyHatchActuatorConnector(key), // new HatchActuatorConnector(key),
            // TODO add more
            _ => throw new ActuatorTypeNotFoundException(type)
        };
}