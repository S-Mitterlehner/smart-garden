using SmartGarden.EntityFramework.Interfaces;

namespace SmartGarden.EntityFramework.Models;

public abstract class BaseEntityWithOrder : BaseEntity, IEntityWithOrder
{
    public int Order { get; set; } = Int32.MaxValue;
}