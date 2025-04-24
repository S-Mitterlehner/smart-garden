using LinqKit;
using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Interfaces;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework;

public class ApplicationContext(DbContextOptions options) : DbContext(options)
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        optionsBuilder.UseLazyLoadingProxies();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Plant>();
        modelBuilder.Entity<PlantSensorConfig>();
        modelBuilder.Entity<SensorRef>();
        modelBuilder.Entity<ActuatorRef>();
        //modelBuilder.Entity<ActuatorAction>();

        modelBuilder.Entity<Bed>()
                    .HasMany(x => x.Sensors)
                    .WithMany()
                    .UsingEntity<Dictionary<string, object>>(
                        "BedSensor",
                        x => x.HasOne<SensorRef>().WithMany().HasForeignKey("SensorId"),
                        x => x.HasOne<Bed>().WithMany().HasForeignKey("BedId"),
                        x =>
                        {
                            x.HasKey("BedId", "SensorId");
                        });
        modelBuilder.Entity<Bed>()
                    .HasMany(x => x.Actuators)
                    .WithMany()
                    .UsingEntity<Dictionary<string, object>>(
                        "BedActuator",
                        x => x.HasOne<ActuatorRef>().WithMany().HasForeignKey("ActuatorId"),
                        x => x.HasOne<Bed>().WithMany().HasForeignKey("BedId"),
                        x =>
                        {
                            x.HasKey("BedId", "ActuatorId");
                        });
    }
    
    public TEntity New<TEntity>() where TEntity : BaseEntity, new()
    {
        var entity = new TEntity { Id = Guid.NewGuid() };
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