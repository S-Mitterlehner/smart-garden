using SmartGarden.Actuators.Models;

namespace SmartGarden.Actuators;

public interface IActuatorListener
{
    public Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions);
}