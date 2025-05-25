using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.ConnectorActionProviders;
public static class HatchModuleConnectorActions
{
    public const string Open = "hatch.open";
    public const string Close = "hatch.close";
    public const string Set = "hatch.set";
}

public class HatchActionsProvider : IConnectorActionsProvider
{
    public IEnumerable<ActionDefinition> GetActions(ModuleState state) => [
        new ActionDefinition
    {
        Name = "Open"
            , ActionType = ActionType.Command
            , Description = "Open the hatch"
            , ActionKey = HatchModuleConnectorActions.Open
            , IsAllowed = true
    },
    new ActionDefinition
    {
        Name = "Close"
            , ActionType = ActionType.Command
            , Description = "Close the hatch"
            , ActionKey = HatchModuleConnectorActions.Close
            , IsAllowed = true
    },
    new ActionDefinition
    {
        Name = "Set"
            , ActionType = ActionType.Value
            , Description = "Set the hatch to a certain value"
            , ActionKey = HatchModuleConnectorActions.Set
            , IsAllowed = true
            , CurrentValue = state.CurrentValue
            , Min = 0
            , Max = 100
            , Unit = "%"
    }
    ];
}