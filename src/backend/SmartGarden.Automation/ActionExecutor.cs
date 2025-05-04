using Microsoft.Extensions.Logging;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.Automation;

public class ActionExecutor(IActuatorManager actuatorManager, ILogger<ActionExecutor> logger)
{
    public async Task ExecuteActionAsync(AutomationRuleAction action)
    {
        var connector = await actuatorManager.GetConnectorAsync(action.Actuator);
        var actionDef = await connector.GetActionDefinitionByKeyAsync(action.ActionKey);

        var execution = new ActionExecution
        {
            Key = action.ActionKey,
            Type = actionDef.ActionType,
            Value = action.Value
        };

        await connector.ExecuteAsync(execution);

        logger.LogInformation("Action {actionKey} sent to Connector {connector} with value {value}", action.ActionKey, connector.Key, action.Value);
    }
}

public static class ActionExecutorExtensions
{
    public static async Task ExecuteActionsAsync(this ActionExecutor executor, IEnumerable<AutomationRuleAction> actions)
    {
        foreach (var action in actions)
        {
            await executor.ExecuteActionAsync(action);
        }
    }
}