using System.ComponentModel.DataAnnotations.Schema;
using SmartGarden.EntityFramework.Core.Models;

namespace SmartGarden.EntityFramework.Beds.Models;

public class AutomationRuleAction : BaseEntityWithOrder
{
    [ForeignKey(nameof(Rule))]
    public Guid RuleId { get; set; }
    public virtual AutomationRule Rule { get; set; }
    
    [ForeignKey(nameof(Module))]
    public Guid ModuleId { get; set; }
    public virtual ModuleRef Module { get; set; }
    
    public string ActionKey { get; set; }
    public double? Value { get; set; }
}