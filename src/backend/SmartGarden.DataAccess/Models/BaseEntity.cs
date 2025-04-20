using System.ComponentModel.DataAnnotations;

namespace SmartGarden.DataAccess.Models;

public abstract class BaseEntity
{
    [Key]
    public Guid Id { get; set; }

    public bool IsDeleted { get; set; } = false;
}