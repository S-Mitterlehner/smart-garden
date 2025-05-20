using Microsoft.Extensions.Logging;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;

namespace SmartGarden.Automation;

public class ActionExecutor(IApiModuleManager actuatorManager, IMessagingProducer messaging, ILogger<ActionExecutor> logger)
{
    public async Task ExecuteActionAsync(AutomationRuleAction action)
    {
        var connector = await actuatorManager.GetConnectorAsync(action.Module);
        var actionDef = await connector.GetActionDefinitionByKeyAsync(action.ActionKey);

        if (!actionDef.IsAllowed)
        {
            logger.LogWarning("Action {actionKey} is not allowed for Connector {connector}", action.ActionKey, connector.Key);
            return;
        }

        var execution = new ActuatorExecutionMessageBody
        {
            ActuatorKey = connector.Key, 
            ActionKey = action.ActionKey, 
            Type = (Messaging.Messages.ActionType)actionDef.ActionType, 
            Value = action.Value
        };
        await messaging.SendAsync(new ActuatorExecutionMessage(execution));

        logger.LogInformation("Action {actionKey} sent to RMQ for Connector {connector} with value {value}", action.ActionKey, connector.Key, action.Value);
    }
}