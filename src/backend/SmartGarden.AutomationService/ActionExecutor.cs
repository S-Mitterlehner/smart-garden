using Microsoft.Extensions.Logging;
using SmartGarden.AutomationService.EntityFramework;
using SmartGarden.AutomationService.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;

namespace SmartGarden.AutomationService;

public class ActionExecutor(AutomationServiceDbContext db, IMessagingProducer messaging, ILogger<ActionExecutor> logger)
{
    public async Task ExecuteActionAsync(AutomationRuleAction action)
    {
        //var actionDef = await db.Get<AutomationRule>().FirstOrDefaultAsync(x => x.Id == action.RuleId);

        //if (!actionDef.IsAllowed)
        //{
        //    logger.LogWarning("Action {actionKey} is not allowed for Connector {connector}", action.ActionKey, connector.Key);
        //    return;
        //}

        var execution = new ActionExecutionMessageBody
        {
            ActuatorKey = action.Module.ModuleKey, 
            ActionKey = action.ActionKey, 
            //Type = (int) action.ActionType, //TODO: fix 
            Value = action.Value
        };
        await messaging.SendAsync(new ActionExecutionMessage(execution));

        logger.LogInformation("Action {actionKey} sent to RMQ for Connector {connector} with value {value}", action.ActionKey, action.Module.ModuleKey, action.Value);
    }
}