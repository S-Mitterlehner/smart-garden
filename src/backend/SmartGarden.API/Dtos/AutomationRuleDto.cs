using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos;

public class AutomationRuleDto : BaseDto
{
    public Guid BedId { get; set; }
    public string Name { get; set; }
    public string Expression { get; set; }
    public List<AutomationRuleActionDto> Actions { get; set; } = new();

    public static Expression<Func<AutomationRule, AutomationRuleDto>> FromEntity => r => 
        new AutomationRuleDto
        {
            Id = r.Id,
            BedId = r.BedId,
            Name = r.Name,
            Expression = r.Expression,
            Actions = r.Actions.AsQueryable().Select(AutomationRuleActionDto.FromEntity).ToList()
        };
}

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