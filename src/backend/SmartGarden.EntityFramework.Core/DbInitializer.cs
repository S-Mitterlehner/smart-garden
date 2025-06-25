using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartGarden.EntityFramework.Core.Seeding;

namespace SmartGarden.EntityFramework.Core;

public class DbInitializer(IServiceProvider serviceProvider) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await using var scope = serviceProvider.CreateAsyncScope();
        var seeder = scope.ServiceProvider.GetRequiredService<ISeeder>();

        await seeder.SeedAsync();
    }
}