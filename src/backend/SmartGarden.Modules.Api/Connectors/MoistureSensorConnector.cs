using Microsoft.Extensions.Logging;
using SmartGarden.Modules.Enums;
using StackExchange.Redis;

namespace SmartGarden.Modules.Api.Connectors;

public class MoistureModuleConnector(string key, IConnectionMultiplexer redis, ILogger logger) : BaseSensorApiModuleConnector(key, redis, logger)
{
    public override ModuleType Type => ModuleType.Moisture;
    public override string Name => "Moisture";
    public override string Description 
        => """
           Soil moisture Module is a device that measures the water content in the soil.
           It is commonly used in gardening to monitor soil conditions.
           """;
}
