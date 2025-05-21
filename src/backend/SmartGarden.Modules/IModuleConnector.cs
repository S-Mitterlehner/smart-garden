using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules;

public interface IModuleConnector
{
    string Key { get; }
    ModuleType Type { get; }
    Task<ModuleState> GetStateAsync();
    Task<IEnumerable<ActionDefinition>> GetActionsAsync();
}

public interface IApiModuleConnector : IModuleConnector
{
    string Name { get; }
    string Description { get; }
    Task UpdateStateAsync(ModuleState state);
    Task<ModuleAutomationConfig> GetAutomationConfigAsync();
}

public interface IServiceModuleConnector : IModuleConnector
{
    string Topic { get; }
    Task InitializeAsync();
    Task ExecuteAsync(ActionExecution execution);
}