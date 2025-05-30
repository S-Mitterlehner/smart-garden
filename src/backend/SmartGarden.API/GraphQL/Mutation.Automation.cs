using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos.Automation;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.GraphQL;

public partial class Mutation
{
    public async Task<AutomationRuleDto?> AddAutomationRuleToBed(
        Guid bedId,
        string automationName,
        string automationExpressionJson,
        [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null) throw new GraphQLException("Bed not found");

        var automationRule = db.New<AutomationRule>();
        automationRule.BedId = bedId;
        automationRule.Name = automationName;
        automationRule.ExpressionJson = automationExpressionJson;
        automationRule.CoolDown = TimeSpan.FromHours(1); // TODO let this be set by the user
        
        bed.Rules.Add(automationRule);
        await db.SaveChangesAsync();
        
        return AutomationRuleDto.FromEntity.Compile().Invoke(automationRule);
    }

    public async Task<AutomationRuleActionDto> AddAutomationRuleActionToModule(
        Guid automationRuleId,
        Guid moduleId,
        string actionKey,
        double? value,
        [Service] ApplicationDbContext db)
    {
        var automationRule = await db.Get<AutomationRule>().FirstOrDefaultAsync(r => r.Id == automationRuleId);
        if (automationRule == null) throw new GraphQLException($"AutomationRule with id {automationRuleId} not found");

        var moduleExists = await db.Get<ModuleRef>().AnyAsync(m => m.Id == moduleId);
        if (!moduleExists) throw new GraphQLException($"Module with id {moduleId} not found");
        
        var automationRuleAction = db.New<AutomationRuleAction>();
        automationRuleAction.RuleId = automationRuleId;
        automationRuleAction.ModuleId = moduleId;
        automationRuleAction.ActionKey = actionKey;
        automationRuleAction.Value = value;
        
        automationRule.Actions.Add(automationRuleAction);
        await db.SaveChangesAsync();
        
        var newRuleAction = await db.Get<AutomationRuleAction>()
            .Include(r => r.Module)
            .FirstOrDefaultAsync(a => a.Id == automationRuleAction.Id);
        return AutomationRuleActionDto.FromEntity.Compile().Invoke(newRuleAction);
    }
}