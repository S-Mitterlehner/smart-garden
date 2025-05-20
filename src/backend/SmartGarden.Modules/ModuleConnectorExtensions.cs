using SmartGarden.Modules.Models;

namespace SmartGarden.Modules;

public static class ModuleConnectorExtensions
{
    public static async Task<ActionDefinition> GetActionDefinitionByKeyAsync(this IModuleConnector connector, string actionKey)
    {
        var actions = await connector.GetActionsAsync();
        var action = actions.FirstOrDefault(a => a.ActionKey.Equals(actionKey, StringComparison.OrdinalIgnoreCase));

        return action ?? throw new InvalidOperationException($"Action with key {actionKey} not found in connector {connector.Key}");
    }
}