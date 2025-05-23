using SmartGarden.Modules.Enums;

namespace SmartGarden.Automation;

public static class AutomationUtils
{
    public static string GetCacheKey(string connectorKey, ModuleType type) => $"{connectorKey}_{type.ToString()}";
    public static string GetCacheKey(string connectorKey, string type) => $"{connectorKey}_{type}";
}