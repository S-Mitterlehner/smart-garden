using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.Modules.Actuators;

[Obsolete("Please change implementation accordingly")]
public interface IActuatorListener
{
    public Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions);
}