using Microsoft.EntityFrameworkCore;
using SmartGarden.DataAccess;
using SmartGarden.DataAccess.Seeder;

namespace SmartGarden.API.Services;

public class DbInitializer(IServiceProvider serviceProvider) : BackgroundService 
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await using var scope = serviceProvider.CreateAsyncScope();
        var seeder = scope.ServiceProvider.GetRequiredService<ISeeder>();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
        
        await db.Database.EnsureCreatedAsync(stoppingToken);

        if(db.Database.HasPendingModelChanges())
            await db.Database.MigrateAsync(stoppingToken);

        await seeder.SeedAsync();
    }
}