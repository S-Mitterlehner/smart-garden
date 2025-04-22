using LinqKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SmartGarden.EntityFramework.Interfaces;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework;

public class ApplicationContext : DbContext
{
    private const string DockerConnectionString = "Server=smartgarden.db;Port=5432;Database=smartgarden;User Id=postgres;Password=postgres;";
    private readonly DatabaseSettings _settings;

    public ApplicationContext() { }

    public ApplicationContext(DbContextOptions<ApplicationContext> options, IOptions<DatabaseSettings> settings) : base(options)
    {
        _settings = settings.Value ?? throw new ArgumentNullException(nameof(settings));
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        optionsBuilder
            .UseLazyLoadingProxies()
            .UseNpgsql(_settings?.ConnectionString ?? DockerConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Plant>();
        modelBuilder.Entity<PlantSensorConfig>();
        modelBuilder.Entity<Sensor>();
        modelBuilder.Entity<Actuator>();
        modelBuilder.Entity<ActuatorAction>();

        modelBuilder.Entity<Bed>()
                    .HasMany(x => x.Sensors)
                    .WithMany()
                    .UsingEntity<Dictionary<string, object>>(
                        "BedSensor",
                        x => x.HasOne<Sensor>().WithMany().HasForeignKey("SensorId"),
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
                        x => x.HasOne<Actuator>().WithMany().HasForeignKey("ActuatorId"),
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

        if (typeof(TEntity).IsAssignableFrom(typeof(IEntityWithOrder))) 
            query = query.OrderBy(x => ((IEntityWithOrder)x).Order);

        return query.AsExpandableEFCore();
    }
}