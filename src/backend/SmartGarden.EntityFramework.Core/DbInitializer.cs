using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartGarden.EntityFramework.Core.Seeding;

namespace SmartGarden.EntityFramework.Core;

public class DbInitializer<TContext>(IServiceProvider serviceProvider) : BackgroundService where TContext : BaseDbContext
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await using var scope = serviceProvider.CreateAsyncScope();
        var seeder = scope.ServiceProvider.GetRequiredService<ISeeder>();
        var db = scope.ServiceProvider.GetRequiredService<TContext>();
        
        await db.Database.EnsureCreatedAsync(stoppingToken);

        if(db.Database.HasPendingModelChanges())
            await db.Database.MigrateAsync(stoppingToken);

        await seeder.SeedAsync();
    }
}