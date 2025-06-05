using System.Linq.Expressions;
using SmartGarden.Api.Core.Dtos;
using SmartGarden.EntityFramework.Beds.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Api.Beds.Dtos.Automation;

public class AutomationRuleActionDto : BaseDto
{
    public Guid RuleId { get; set; }
    public Guid ModuleId { get; set; }
    
    public string? ModuleKey { get; set; }
    public ModuleType? ModuleType { get; set; }
    
    public string? ActionKey { get; set; }
    public double? Value { get; set; }

    public int? Order { get; set; }

    public static Expression<Func<AutomationRuleAction, AutomationRuleActionDto>> FromEntity => a =>
        new AutomationRuleActionDto
        {
            Id = a.Id,
            RuleId = a.RuleId,
            ModuleId = a.ModuleId,
            ModuleKey = a.Module.ModuleKey,
            ModuleType = a.Module.Type,
            ActionKey = a.ActionKey,
            Value = a.Value,
            Order = a.Order
        };
}