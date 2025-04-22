using SmartGarden.Actuators.Models;

namespace SmartGarden.Actuators;

public static class ActuatorConnectorExtensions
{
    public static async Task<ActionDefinition> GetActionDefinitionByKeyAsync(this IActuatorConnector connector, string key)
    {
        var actions = await connector.GetActionsAsync();
        var action = actions.FirstOrDefault(x => x.Key == key);
        if (action == null)
            throw new Exception($"Action with key {key} not found");

        return action;
    }
}