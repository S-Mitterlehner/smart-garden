using Microsoft.Extensions.Logging;
using SmartGarden.AutomationService.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;

namespace SmartGarden.AutomationService;

public class ActionExecutor(IMessagingProducer messaging,  ILogger<ActionExecutor> logger)
{
    public async Task ExecuteActionAsync(AutomationRuleAction action)
    {
        var execution = new ActionExecutionMessageBody
        {
            ModuleKey = action.Module.ModuleKey, 
            ModuleType = (int) action.Module.Type,
            ActionKey = action.ActionKey, 
            Value = action.Value
        };
        await messaging.SendAsync(new ActionExecutionMessage(execution));

        logger.LogInformation("Action {actionKey} sent to RMQ for Connector {connector}/{type} with value {value}", action.ActionKey, action.Module.ModuleKey, action.Module.Type, action.Value);
    }
}