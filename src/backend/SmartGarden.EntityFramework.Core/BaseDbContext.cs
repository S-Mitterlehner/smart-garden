using LinqKit;
using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Core.Interfaces;
using SmartGarden.EntityFramework.Core.Models;

namespace SmartGarden.EntityFramework.Core;

public abstract class BaseDbContext(DbContextOptions options) : DbContext(options)
{
    public TEntity New<TEntity>() where TEntity : BaseEntity, new()
    {
        return New<TEntity>(Guid.NewGuid());
    }
    
    public TEntity New<TEntity>(Guid guid) where TEntity : BaseEntity, new()
    {
        var entity = new TEntity { Id = guid };
        Set<TEntity>().Add(entity);

        return entity;
    }

    public IQueryable<TEntity> Get<TEntity>(bool includeDeleted = false) where TEntity : BaseEntity
    {
        var query = Set<TEntity>().AsQueryable().Where(x => includeDeleted || !x.IsDeleted);

        if (typeof(TEntity).IsAssignableTo(typeof(IEntityWithOrder))) 
            query = query.OrderBy(x => ((IEntityWithOrder)x).Order);

        return query.AsExpandableEFCore();
    }
}