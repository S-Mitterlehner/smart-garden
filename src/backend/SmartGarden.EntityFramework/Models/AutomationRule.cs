using System.ComponentModel.DataAnnotations.Schema;

namespace SmartGarden.EntityFramework.Models;

public class AutomationRule : BaseEntityWithOrder
{
    [ForeignKey(nameof(Bed))] 
    public Guid BedId { get; set; }
    public virtual Bed Bed { get; set; }

    public string Name { get; set; }

    public string ExpressionJson { get; set; }


    public bool IsEnabled { get; set; } = true;

    public DateTime? LastActionRunAt { get; set; }

    public TimeSpan CoolDown { get; set; }
    
    public virtual List<AutomationRuleAction> Actions { get; set; } = new();
}