using SmartGarden.Modules.Enums;

namespace SmartGarden.AutomationService;

public static class AutomationUtils
{
    public static string GetCacheKey(string connectorKey, ModuleType type) => GetCacheKey(connectorKey, type.ToString());
    public static string GetCacheKey(string connectorKey, string type) => $"{connectorKey}_{type.ToLower()}";
}