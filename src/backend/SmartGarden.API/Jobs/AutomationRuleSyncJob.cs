using Microsoft.EntityFrameworkCore;
using Quartz;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;

namespace SmartGarden.API.Jobs;

public class AutomationRuleSyncJob(ApplicationDbContext db, IMessagingProducer messaging) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var rules = await db.Get<AutomationRule>().ToListAsync();

        foreach (var rule in rules)
        {
            var msg = new AutomationRuleMessage(new AutomationRuleMessageBody
            {
                Id = rule.Id,
                Name = rule.Name,
                ExpressionJson = rule.ExpressionJson,
                IsEnabled = rule.IsEnabled,
                LastActionRunAt = rule.LastActionRunAt,
                CoolDown = rule.CoolDown,
                Actions = rule.Actions.Select(x => new AutomationRuleActionMesssageItem
                {
                    ModuleId = x.ModuleId,
                    ActionKey = x.ActionKey,
                    Value = x.Value
                }).ToList()
            });

            await messaging.SendAsync(msg);
        }
    }
}