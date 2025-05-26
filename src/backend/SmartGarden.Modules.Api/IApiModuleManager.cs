using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Api;

public interface IApiModuleManager
{
    Task<IApiModuleConnector> GetConnectorAsync(IModuleRef reference);
}