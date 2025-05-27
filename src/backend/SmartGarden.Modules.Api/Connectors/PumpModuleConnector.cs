using Microsoft.Extensions.Logging;
using SmartGarden.Modules.ConnectorActionProviders;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using StackExchange.Redis;

namespace SmartGarden.Modules.Api.Connectors;



public class PumpModuleConnector(string key, IConnectionMultiplexer redis, ILogger<PumpModuleConnector> logger) : BaseActuatorApiModuleConnector(key, redis, logger)
{
    public override ModuleType Type => ModuleType.Pump;
    public override string Name => "Water Pump";
    public override string Description => "Water Pump for irrigation";

    public override async Task<ModuleAutomationConfig> GetAutomationConfigAsync() => new()
    {
        ModuleType = Type,
        ModuleKey = Key,
        ValueType = StateType.Discrete,
        TsType = "select",
        Values = [
            new DiscreteValue
            {
                Label = "Running",
                Value = PumpModuleConnectorStates.Running
            },
            new DiscreteValue
            {
                Label = "Stopped",
                Value = PumpModuleConnectorStates.Stopped
            }
        ],
    };
}