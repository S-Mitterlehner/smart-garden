using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos.Automation;

public class AutomationRuleActionDto : BaseDto
{
    public Guid RuleId { get; set; }
    public Guid ActuatorId { get; set; }
    
    public string ActuatorKey { get; set; }
    public string ActuatorType { get; set; }
    
    public string ActionKey { get; set; }
    public double? Value { get; set; }

    public int Order { get; set; }

    public static Expression<Func<AutomationRuleAction, AutomationRuleActionDto>> FromEntity => a =>
        new AutomationRuleActionDto
        {
            Id = a.Id,
            RuleId = a.RuleId,
            ActuatorId = a.ActuatorId,
            ActuatorKey = a.Actuator.ConnectorKey,
            ActuatorType = a.Actuator.Type.ToString(),
            ActionKey = a.ActionKey,
            Value = a.Value,
            Order = a.Order
        };
}