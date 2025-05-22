namespace SmartGarden.Modules.Api;

internal static class Utils
{
    public static string GetCacheKey(string moduleKey, string moduleType) => $"Module:{moduleKey}:{moduleType}";
}