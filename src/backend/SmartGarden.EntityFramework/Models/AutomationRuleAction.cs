using System.ComponentModel.DataAnnotations.Schema;

namespace SmartGarden.EntityFramework.Models;

public class AutomationRuleAction : BaseEntityWithOrder
{
    [ForeignKey(nameof(Rule))]
    public Guid RuleId { get; set; }
    public virtual AutomationRule Rule { get; set; }
    
    [ForeignKey(nameof(Actuator))]
    public Guid ActuatorId { get; set; }
    public virtual ActuatorRef Actuator { get; set; }
    
    public string ActionKey { get; set; }
    public double? Value { get; set; }
}