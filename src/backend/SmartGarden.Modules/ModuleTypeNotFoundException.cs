using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules;

public class ModuleTypeNotFoundException(ModuleType type): Exception($"Connector for Module type '{type}' not found.");