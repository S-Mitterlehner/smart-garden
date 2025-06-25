using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Dtos.Automation;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.GraphQL;

public partial class Mutation
{
    //TODO:  Make SaveAutomationRule(AutomationRuleDto dto), remove add and update
    //TODO: Also Update Actions and remove Add + Remove Action

    [Obsolete("Will be changed to SaveAutomationRule in the future")]
    public async Task<AutomationRuleDto> AddAutomationRuleToBed(
        Guid bedId,
        string automationName,
        string automationExpressionJson,
        bool isEnabled,
        [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null) throw new GraphQLException("Bed not found");

        var automationRule = db.New<AutomationRule>();
        automationRule.BedId = bedId;
        automationRule.Name = automationName;
        automationRule.ExpressionJson = automationExpressionJson;
        automationRule.IsEnabled = isEnabled;
        automationRule.CoolDown = TimeSpan.FromHours(1); // TODO should be configurable by the user
        
        bed.Rules.Add(automationRule);
        await db.SaveChangesAsync();
        
        return AutomationRuleDto.FromEntity.Compile().Invoke(automationRule);
    }

    [Obsolete("Will be changed to SaveAutomationRule in the future")]
    public async Task<AutomationRuleDto> UpdateAutomationRuleFromBed(AutomationRuleDto automationRuleDto,
        [Service] ApplicationDbContext db)
    {
        var rule = await db.Get<AutomationRule>()
            .FirstOrDefaultAsync(r => r.Id == automationRuleDto.Id);
        if (rule == null) throw new GraphQLException($"AutomationRule with id {automationRuleDto.Id} not found");
        
        rule.Name = automationRuleDto.Name;
        rule.ExpressionJson = automationRuleDto.ExpressionJson;
        rule.IsEnabled = automationRuleDto.IsEnabled;
        rule.CoolDown = TimeSpan.FromHours(1); // TODO should be configurable by the user
        //TODO: Update Actions
        await db.SaveChangesAsync();
        
        return AutomationRuleDto.FromEntity.Compile().Invoke(rule);
    }

    [Obsolete("Will be changed to SaveAutomationRule in the future")]
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

    [Obsolete("Will be changed to SaveAutomationRule in the future")]
    public async Task<AutomationRuleActionDto> UpdateAutomationRuleActionFromModule(
        AutomationRuleActionDto automationRuleActionDto,
        [Service] ApplicationDbContext db)
    {
        var action = await db.Get<AutomationRuleAction>()
            .Include(a => a.Module)
            .FirstOrDefaultAsync(a => a.Id == automationRuleActionDto.Id);
        if (action == null) throw new GraphQLException($"AutomationRuleAction with id {automationRuleActionDto.Id} not found");
        
        if (action.ModuleId != automationRuleActionDto.ModuleId)
        {
            var moduleExists = await db.Get<ModuleRef>()
                .AnyAsync(m => m.Id == automationRuleActionDto.ModuleId);
            if (!moduleExists) throw new GraphQLException($"Module with id {automationRuleActionDto.ModuleId} not found");

            action.ModuleId = automationRuleActionDto.ModuleId;
        }
        if (automationRuleActionDto.ActionKey is not null)
        {
            action.ActionKey = automationRuleActionDto.ActionKey;
        }
        action.Value = automationRuleActionDto.Value;
        await db.SaveChangesAsync();

        return AutomationRuleActionDto.FromEntity.Compile().Invoke(action);
    }
    
    public async Task<bool> RemoveAutomationRule(Guid automationRuleId,
        [Service] ApplicationDbContext db)
    {
        var rule = await db.Get<AutomationRule>().FirstOrDefaultAsync(b => b.Id == automationRuleId);
        if (rule == null)  throw new GraphQLException($"AutomationRule with id {automationRuleId} not found");
        
        db.Remove(rule);
        await db.SaveChangesAsync();
        return true;
    }

    [Obsolete("Will be changed to SaveAutomationRule in the future")]
    public async Task<bool> RemoveAutomationRuleAction(Guid actionId,
        [Service] ApplicationDbContext db)
    {
        var action = await db.Get<AutomationRuleAction>().FirstOrDefaultAsync(a => a.Id == actionId);
        if (action == null)  throw new GraphQLException($"AutomationRuleAction with id {actionId} not found");

        db.Remove(action);
        await db.SaveChangesAsync();
        return true;
    }
}