using Microsoft.Extensions.Logging;
using SmartGarden.Modules.Api;
using SmartGarden.Modules.Enums;
using StackExchange.Redis;

namespace SmartGarden.Modules.Modules.Connectors;

public class HumidityModuleConnector(string key, IConnectionMultiplexer redis, ILogger logger) : BaseSensorApiModuleConnector(key, redis, logger)
{
    public override ModuleType Type => ModuleType.Humidity;
    public override string Name => "Humidity";
    public override string Description => "Humidity Module is a device that measures the humidity of the environment. It is often used in weather stations.";
}