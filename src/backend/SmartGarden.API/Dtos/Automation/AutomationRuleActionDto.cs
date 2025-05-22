using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.Dtos.Automation;

public class AutomationRuleActionDto : BaseDto
{
    public Guid RuleId { get; set; }
    public Guid ActuatorId { get; set; }
    
    public string ActuatorKey { get; set; }
    public ModuleType ActuatorType { get; set; }
    
    public string ActionKey { get; set; }
    public double? Value { get; set; }

    public int Order { get; set; }

    public static Expression<Func<AutomationRuleAction, AutomationRuleActionDto>> FromEntity => a =>
        new AutomationRuleActionDto
        {
            Id = a.Id,
            RuleId = a.RuleId,
            ActuatorId = a.ModuleId,
            ActuatorKey = a.Module.ModuleKey,
            ActuatorType = a.Module.Type,
            ActionKey = a.ActionKey,
            Value = a.Value,
            Order = a.Order
        };
}