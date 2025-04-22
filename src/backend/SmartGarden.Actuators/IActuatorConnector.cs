using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;

namespace SmartGarden.Actuators;

public interface IActuatorConnector
{
    string Key { get; }
    string Name { get; }
    string Description { get; }
    Task<ActuatorState> GetStateAsync();
    Task<IEnumerable<ActionDefinition>> GetActionsAsync();
    Task ExecuteAsync(ActionExecution execution);
}