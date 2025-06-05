using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Core.Models;

namespace SmartGarden.EntityFramework.Core.Seeding;

public abstract class BaseSeeder(BaseDbContext context) : ISeeder
{
    public virtual async Task SeedAsync()
    {
        await context.Database.EnsureCreatedAsync();

        if(context.Database.HasPendingModelChanges())
            await context.Database.MigrateAsync();

        await Initialize();

        await context.SaveChangesAsync();
    }

    protected abstract Task Initialize();

    /// <summary>
    ///     Creates a new entity if it does not exist in the database.
    ///     Doesn't override existing changes
    /// </summary>
    protected async Task<T> CreateAsync<T>(T entity) where T : BaseEntity
    {
        if (!(await context.Get<T>().AnyAsync(x => x.Id == entity.Id)))
            await context.Set<T>().AddAsync(entity);
        else
            context.Attach(entity);

        return entity;
    }

    /// <summary>
    ///     Creates a new entity if it does not exist or updates the entity if it does.
    ///     Overrides existing changes
    /// </summary>
    protected async Task<T> CreateOrUpdateAsync<T>(T entity) where T : BaseEntity // TODO: Change name
    {
        var existingEntity = await context.Get<T>().FirstOrDefaultAsync(x => x.Id == entity.Id);
        if (existingEntity != null)
        {
            context.Entry(existingEntity).CurrentValues.SetValues(entity);
            context.Entry(existingEntity).State = EntityState.Modified;
            return existingEntity;
        }

        await context.Set<T>().AddAsync(entity);
        return entity;
    }
}