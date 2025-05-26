using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SmartGarden.ConnectorService.EntityFramework;
using SmartGarden.ConnectorService.EntityFramework.Models;
using SmartGarden.Modules;
using SmartGarden.Modules.Service;

namespace SmartGarden.ConnectorService.Services;

public class ConnectorManagingService(IServiceProvider sp, ILogger<ConnectorManagingService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var manager = sp.GetRequiredService<IServiceModuleManager>();

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(10000, stoppingToken);

            using var scope = sp.CreateScope();
            await using var db = scope.ServiceProvider.GetRequiredService<ConnectionServiceDbContext>();

            var references = await db.Get<ModuleRef>().ToListAsync(cancellationToken: stoppingToken);

            foreach (var reference in references)
            {
                try
                {
                    var connector = await manager.GetConnectorAsync(reference);
                }
                catch (Exception ex)
                {
                    logger.LogError("Error getting Connector for {reference}: {ex}", reference, ex);
                }
            }
        }
    }
}