using SmartGarden.Modules.Models;

namespace SmartGarden.Modules;

public interface IModuleConnector<out TModuleType> : IModuleConnector where TModuleType : Enum
{
    TModuleType Type { get; }
}

public interface IModuleConnector
{
    string Key { get; }
    string Topic { get; }
    string Name { get; }
    string Description { get; }
    Task InitializeAsync();
    Task<ModuleAutomationConfig> GetAutomationConfigAsync();
}