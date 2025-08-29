using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Dtos.Automation;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Api.Beds.GraphQL;

public partial class Mutation
{
    public async Task<AutomationRuleDto> SaveAutomationRule(
        AutomationRuleDto dto,
        [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == dto.BedId);
        if (bed == null) throw new GraphQLException("Bed not found");

        var automationRule = db.New<AutomationRule>();
        automationRule.BedId = dto.BedId;
        automationRule.Name = dto.Name;
        automationRule.ExpressionJson = dto.ExpressionJson;
        automationRule.IsEnabled = dto.IsEnabled;
        automationRule.CoolDown = TimeSpan.FromHours(1); // TODO should be configurable by the user

        // Remove all actions from the rule, then add new ones. 
        // TODO Improve so that we don't have to remove all actions
        automationRule.Actions.Clear();
        await db.SaveChangesAsync();

        if (dto.Actions != null)
            automationRule.Actions.AddRange(dto.Actions
                .Select(a =>
                {
                    var action = db.New<AutomationRuleAction>(a.Id);
                    action.ActionKey = a.ActionKey;
                    action.ModuleId = a.ModuleId;
                    action.Module = bed.Modules.FirstOrDefault(m => m.Id == a.ModuleId); //TODO: Fix
                    action.Value = a.Value;
                    return action;
                }));

        bed.Rules.Add(automationRule);
        await db.SaveChangesAsync();
        
        return AutomationRuleDto.FromEntity.Compile().Invoke(automationRule);
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
}