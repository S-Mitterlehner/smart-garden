using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Api;

public interface IApiModuleConnector : IModuleConnector
{
    string Name { get; }
    string Description { get; }
    Task UpdateStateAsync(ModuleState state);
    Task<ModuleAutomationConfig> GetAutomationConfigAsync();
}