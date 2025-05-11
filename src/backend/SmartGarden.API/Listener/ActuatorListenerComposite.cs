using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.API.Listener;

public class ActuatorListenerComposite(params IActuatorListener[] listeners) : IActuatorListener
{
    public async Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
    {
        foreach (var l in listeners)
        {
            await l.PublishStateChangeAsync(data, actions);
        }
    }
}