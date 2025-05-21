using Microsoft.Extensions.Hosting;
using SmartGarden.Modules;

namespace SmartGarden.ExecutorService;

public class ModuleInitializerHostedService(IServiceModuleManager moduleManager) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        await moduleManager.SetupRegisterListenerAsync();
    }
}