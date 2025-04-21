using LinqKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework;

public class ApplicationContext : DbContext
{
    private readonly DatabaseSettings _settings;

    public ApplicationContext() { }

    public ApplicationContext(DbContextOptions<ApplicationContext> options, IOptions<DatabaseSettings> settings) : base(options)
    {
        _settings = settings.Value ?? throw new ArgumentNullException(nameof(settings));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Beet>();
        modelBuilder.Entity<Plant>();
    }
    
    public TEntity New<TEntity>() where TEntity : BaseEntity, new()
    {
        var entity = new TEntity { Id = Guid.NewGuid() };
        Set<TEntity>().Add(entity);

        return entity;
    }

    public IQueryable<TEntity> Get<TEntity>(bool includeDeleted = false) where TEntity : BaseEntity 
        => Set<TEntity>().Where(x => includeDeleted || !x.IsDeleted)
                         .AsExpandableEFCore();
}