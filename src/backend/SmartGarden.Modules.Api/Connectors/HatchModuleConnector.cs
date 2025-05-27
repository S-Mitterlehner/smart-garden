using Microsoft.Extensions.Logging;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using StackExchange.Redis;

namespace SmartGarden.Modules.Api.Connectors;


public class HatchModuleConnector(string key, IConnectionMultiplexer redis, ILogger<HatchModuleConnector> logger) : BaseActuatorApiModuleConnector(key, redis, logger)
{
    public override ModuleType Type => ModuleType.Hatch;
    public override string Name => "Hatch";
    public override string Description => "Hatch Module for opening and closing hatches.";
    
    public override async Task<ModuleAutomationConfig> GetAutomationConfigAsync() => new()
    {
        ModuleKey = Key,
        ModuleType = ModuleType.Hatch,
        ValueType = StateType.Continuous,
        TsType = "number",
        Min = 0,
        Max = 100,
        Unit = "%"
    };
}