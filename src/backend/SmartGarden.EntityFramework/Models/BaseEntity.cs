using System.ComponentModel.DataAnnotations;

namespace SmartGarden.EntityFramework.Models;

public abstract class BaseEntity
{
    [Key]
    public Guid Id { get; set; }

    public bool IsDeleted { get; set; } = false;
}