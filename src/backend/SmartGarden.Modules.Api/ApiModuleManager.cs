using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Api;

public class ApiModuleManager : IApiModuleManager
{

    public Task<IApiModuleConnector> GetConnectorAsync(IModuleRef reference) => throw new NotImplementedException();
}