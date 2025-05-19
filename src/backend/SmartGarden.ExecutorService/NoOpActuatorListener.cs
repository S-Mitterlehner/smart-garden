using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.ExecutorService;

public class NoOpActuatorListener : IActuatorListener
{
    public Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
    {
        return Task.CompletedTask;
    }
}