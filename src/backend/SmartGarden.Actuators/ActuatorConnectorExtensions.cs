using SmartGarden.Actuators.Models;

namespace SmartGarden.Actuators;

public static class ActuatorConnectorExtensions
{
    public static async Task<ActionDefinition> GetActionDefinitionByKeyAsync(this IActuatorConnector connector, string actionKey)
    {
        var actions = await connector.GetActionsAsync();
        var action = actions.FirstOrDefault(x => x.Key == actionKey);
        if (action == null)
            throw new Exception($"Action with key {actionKey} not found");

        return action;
    }
}