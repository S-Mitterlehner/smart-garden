using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.ConnectorActionProviders;

public static class ConnectorActionsProviderFactory
{
    public static IConnectorActionsProvider GetActionsProvider(ModuleType moduleType)
    {
        switch (moduleType)
        {
            case ModuleType.Pump:
                return new PumpActionsProvider();
            case ModuleType.Hatch:
                return new HatchActionsProvider();
            case ModuleType.Temperature:
            case ModuleType.Humidity:
            case ModuleType.Moisture:
            default:
                throw new ArgumentOutOfRangeException(nameof(moduleType), $"No actions provider for module type {moduleType}");
        }
    }
}