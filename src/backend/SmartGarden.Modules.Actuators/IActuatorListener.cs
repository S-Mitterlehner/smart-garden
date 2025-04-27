using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.Modules.Actuators;

public interface IActuatorListener
{
    public Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions);
}