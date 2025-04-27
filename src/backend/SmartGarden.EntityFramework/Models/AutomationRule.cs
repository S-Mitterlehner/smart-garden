using System.ComponentModel.DataAnnotations.Schema;

namespace SmartGarden.EntityFramework.Models;

public class AutomationRule : BaseEntityWithOrder
{
    [ForeignKey(nameof(Bed))] 
    public Guid BedId { get; set; }
    public virtual Bed Bed { get; set; }
    
    public string Name { get; set; }
    public string Expression { get; set; }
    
    public virtual List<AutomationRuleAction> Actions { get; set; } = new();
}