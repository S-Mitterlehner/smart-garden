using System.ComponentModel.DataAnnotations.Schema;

namespace SmartGarden.EntityFramework.Models;

public class Bed : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }


    [ForeignKey(nameof(Plant))]
    public Guid PlantId { get; set; }
    public virtual Plant Plant { get; set; }

    public virtual List<SensorRef> Sensors { get; set; } = new();
    public virtual List<ActuatorRef> Actuators { get; set; } = new();
}