using System.ComponentModel.DataAnnotations.Schema;
using SmartGarden.EntityFramework.Core.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.EntityFramework.Models;

public class Bed : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }


    [ForeignKey(nameof(Plant))]
    public Guid PlantId { get; set; }
    public virtual Plant Plant { get; set; }

    public virtual List<ModuleRef> Modules { get; set; } = new();
    public virtual List<AutomationRule> Rules { get; set; } = new();

    [NotMapped]
    public virtual IEnumerable<ModuleRef> Actuators => Modules
        .Where(m => m.Type.IsActuator());
   
    [NotMapped]
    public virtual IEnumerable<ModuleRef> Sensors => Modules
        .Where(m => m.Type.IsSensor());
        
}