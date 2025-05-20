using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Models;

public record ModuleRefRecord(string ModuleKey, ModuleType Type) : IModuleRef;