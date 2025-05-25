using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.ConnectorActionProviders;

public interface IConnectorActionsProvider
{
    IEnumerable<ActionDefinition> GetActions(ModuleState state);
}

public static class ConnectorActionsProviderFactory
{
    public static IConnectorActionsProvider GetActionsProvider(ModuleType moduleType) => moduleType switch
    {
        ModuleType.Pump => new PumpActionsProvider(),
        ModuleType.Hatch => new HatchActionsProvider()
        , ModuleType.Temperature => throw new NotSupportedException("Temperature module does not support actions")
        , ModuleType.Humidity => throw new NotSupportedException("Humidity module does not support actions")
        , ModuleType.Moisture => throw new NotSupportedException("Moisture module does not support actions")
        , _ => throw new ArgumentOutOfRangeException(nameof(moduleType), $"No actions provider for module type {moduleType}")
    };
}