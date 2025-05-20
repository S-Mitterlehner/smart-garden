using SmartGarden.EntityFramework.Core.Interfaces;

namespace SmartGarden.EntityFramework.Core.Models;

public abstract class BaseEntityWithOrder : BaseEntity, IEntityWithOrder
{
    public int Order { get; set; } = Int32.MaxValue;
}