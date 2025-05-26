using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Service;

public interface IServiceModuleManager
{
    Task SetupRegisterListenerAsync();
    Task<IServiceModuleConnector> GetConnectorAsync(IModuleRef reference);
}