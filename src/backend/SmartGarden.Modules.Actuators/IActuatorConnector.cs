using SmartGarden.Modules.Actuators.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Actuators;

public interface IActuatorConnector : IModuleConnector<ActuatorType>
{
    Task<ActuatorState> GetStateAsync();
    Task<IEnumerable<ActionDefinition>> GetActionsAsync();
    Task ExecuteAsync(ActionExecution execution);
}