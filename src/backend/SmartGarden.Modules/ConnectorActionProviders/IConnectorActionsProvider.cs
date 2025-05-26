using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.ConnectorActionProviders;

public interface IConnectorActionsProvider
{
    IEnumerable<ActionDefinition> GetActions(ModuleState state);
}