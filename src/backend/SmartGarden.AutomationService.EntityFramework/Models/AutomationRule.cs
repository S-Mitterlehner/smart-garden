using SmartGarden.EntityFramework.Core.Models;

namespace SmartGarden.AutomationService.EntityFramework.Models;

public class AutomationRule : BaseEntity
{
    public string Name { get; set; }
    public string ExpressionJson { get; set; }

    public bool IsEnabled { get; set; } = true;

    public DateTime? LastActionRunAt { get; set; }

    public TimeSpan CoolDown { get; set; }
    
    public virtual List<AutomationRuleAction> Actions { get; set; } = new();
}