using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework.Seeder;

public abstract class BaseSeeder(ApplicationContext context) : ISeeder
{
    public async Task SeedAsync()
    {
        await context.Database.EnsureCreatedAsync();

        await Initialize();

        await context.SaveChangesAsync();
    }

    protected abstract Task Initialize();

    /// <summary>
    ///     Creates a new entity if it does not exist in the database.
    ///     Doesn't override existing changes
    /// </summary>
    protected async Task CreateAsync<T>(T entity) where T : BaseEntity
    {
        if (!(await context.Get<T>().AnyAsync(x => x.Id == entity.Id))) 
            await context.Set<T>().AddAsync(entity);
    }

    /// <summary>
    ///     Creates a new entity if it does not exist or updates the entity if it does.
    ///     Overrides existing changes
    /// </summary>
    protected async Task InsertAsync<T>(T entity) where T : BaseEntity // TODO: Change name
    {
        var existingEntity = await context.Get<T>().FirstOrDefaultAsync(x => x.Id == entity.Id);
        if (existingEntity != null)
            context.Entry(existingEntity).CurrentValues.SetValues(entity);
        else
            await context.Set<T>().AddAsync(entity);
    }
}