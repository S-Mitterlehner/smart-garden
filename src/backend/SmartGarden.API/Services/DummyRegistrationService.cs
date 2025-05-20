using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Sensors;

namespace SmartGarden.API.Services;

/// <summary>
///     Dummy service to simulate the automatic "registration" of Sensors and Actuators
/// </summary>
/// <param name="moduleManager"></param>
public class DummyRegistrationService(IServiceProvider sp, IServiceModuleManager moduleManager) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await using var scope = sp.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var modules = await db.Get<ModuleRef>().Where(x => x.ModuleKey != null).ToListAsync(cancellationToken: stoppingToken);

        foreach (var moduleRef in modules)
        {
            await moduleManager.GetConnectorAsync(moduleRef);
        }
    }
}