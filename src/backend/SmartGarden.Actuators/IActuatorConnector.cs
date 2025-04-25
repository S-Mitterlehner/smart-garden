using SmartGarden.Actuators.Enums;
using SmartGarden.Actuators.Models;
using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators;

public interface IActuatorConnector
{
    string Key { get; }
    ActuatorType Type { get; }
    string Name { get; }
    string Topic { get; }
    string Description { get; }

    Task InitializeAsync();
    Task<ActuatorState> GetStateAsync();
    Task<IEnumerable<ActionDefinition>> GetActionsAsync();
    Task ExecuteAsync(ActionExecution execution);
}