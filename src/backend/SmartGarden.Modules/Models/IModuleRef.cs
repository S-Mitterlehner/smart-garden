using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Models;

public interface IModuleRef
{
    string ModuleKey { get; }
    ModuleType Type { get; }
}

public interface IModuleRefWithTopic : IModuleRef
{
    string Topic { get; }
}