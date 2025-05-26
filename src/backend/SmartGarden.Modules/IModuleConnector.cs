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