using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartGarden.AutomationService.EntityFramework;
using SmartGarden.AutomationService.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;

namespace SmartGarden.AutomationService.MessageHandler;

public class AutomationRuleMessageHandler(AutomationServiceDbContext db, ILogger<AutomationRuleMessageHandler> logger) 
    : IMessageHandler<AutomationRuleMessageBody>
{
    public async Task HandleAsync(AutomationRuleMessageBody msgBody)
    {
        var entry = await db.Get<AutomationRule>().FirstOrDefaultAsync(x => x.Id == msgBody.Id);
        if (entry is not null)
        {
            db.Remove(entry);
            await db.SaveChangesAsync();
        }
        
        entry = db.New<AutomationRule>(msgBody.Id);
        entry.Name = msgBody.Name;
        entry.ExpressionJson = msgBody.ExpressionJson;
        entry.IsEnabled = msgBody.IsEnabled;
        entry.CoolDown = msgBody.CoolDown;
        entry.Actions = msgBody.Actions.Select(x => new AutomationRuleAction
        {
            ModuleId = x.ModuleId,
            ActionKey = x.ActionKey,
            Value = x.Value
        }).ToList();
        
        await db.SaveChangesAsync();
        
        logger.LogDebug("Registered/Updated AutomationRule: {name} with id {id}", entry.Name, entry.Id);
    }
}