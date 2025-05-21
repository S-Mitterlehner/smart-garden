using Microsoft.Extensions.Logging;
using SmartGarden.Modules.Enums;
using StackExchange.Redis;

namespace SmartGarden.Modules.Api.Connectors;

public class TemperatureModuleConnector(string key, IConnectionMultiplexer redis, ILogger<TemperatureModuleConnector> logger) : BaseSensorApiModuleConnector(key, redis, logger)
{
    public override ModuleType Type => ModuleType.Temperature;
    public override string Name => "Temperature";
    public override string Description => "Temperature Module is a device that measures the temperature of the environment. It is often used in weather stations.";
}