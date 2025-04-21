using System.ComponentModel.DataAnnotations.Schema;

namespace SmartGarden.EntityFramework.Models;

public class Beet : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }


    [ForeignKey(nameof(Plant))]
    public Guid PlantId { get; set; }
    public Plant Plant { get; set; }
}