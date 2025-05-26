using Microsoft.Extensions.Hosting;
using SmartGarden.Modules;
using SmartGarden.Modules.Service;

namespace SmartGarden.ConnectorService;

public class ModuleInitializerHostedService(IServiceModuleManager moduleManager) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        await moduleManager.SetupRegisterListenerAsync();
    }
}