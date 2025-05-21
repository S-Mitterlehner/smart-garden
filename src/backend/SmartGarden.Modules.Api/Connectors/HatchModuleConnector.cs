using Microsoft.Extensions.Logging;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using StackExchange.Redis;

namespace SmartGarden.Modules.Api.Connectors;

public static class HatchModuleConnectorActions
{
    public const string Open = "hatch.open";
    public const string Close = "hatch.close";
    public const string Set = "hatch.set";
}

public class HatchModuleConnector(string key, IConnectionMultiplexer redis, ILogger<HatchModuleConnector> logger) : BaseActuatorApiModuleConnector(key, redis, logger)
{
    public override ModuleType Type => ModuleType.Hatch;
    public override string Name => "Hatch";
    public override string Description => "Hatch Module for opening and closing hatches.";
    
    public override async Task<IEnumerable<ActionDefinition>> GetActionsAsync()
    {
        var state = await GetStateAsync();
        
        return [
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

    public override async Task<ModuleAutomationConfig> GetAutomationConfigAsync()
    {
        return new ModuleAutomationConfig
        {
            // TODO ???
        };
    }
}