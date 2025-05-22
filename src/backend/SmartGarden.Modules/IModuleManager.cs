using SmartGarden.Modules.Models;

namespace SmartGarden.Modules;

public interface IApiModuleManager
{
    Task<IApiModuleConnector> GetConnectorAsync(IModuleRef reference);
}

public interface IServiceModuleManager
{
    Task SetupRegisterListenerAsync();
    Task<IServiceModuleConnector> GetConnectorAsync(IModuleRef reference);
}