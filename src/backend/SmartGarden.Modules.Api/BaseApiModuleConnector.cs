using System.Text.Json;
using Microsoft.Extensions.Logging;
using SmartGarden.Modules.ConnectorActionProviders;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using StackExchange.Redis;

namespace SmartGarden.Modules.Api;

public abstract class BaseApiModuleConnector(string key, IConnectionMultiplexer redis, ILogger logger) : IApiModuleConnector
{
    public string Key => key;
    public abstract ModuleType Type { get; }
    public abstract string Name { get; }
    public abstract string Description { get; }

    public abstract Task<IEnumerable<ActionDefinition>> GetActionsAsync();

    public async Task UpdateStateAsync(ModuleState state)
    {
        var cacheKey = Utils.GetCacheKey(Key, Type.ToString());
        try
        {
            var db = redis.GetDatabase();
            var val = JsonSerializer.Serialize(state);

            await db.StringSetAsync(cacheKey, val, TimeSpan.FromMinutes(2)); //TODO: from config
        }
        catch (Exception ex)
        {
            logger.LogError("Error updating state in cache for {key}: {@ex}", cacheKey, ex);
        }
    }

    public async Task<ModuleState> GetStateAsync()
    {
        var cacheKey = Utils.GetCacheKey(Key, Type.ToString());
        try
        {
            var db = redis.GetDatabase();
            var state = await db.StringGetAsync(cacheKey);

            if (state.IsNullOrEmpty)
                throw new Exception($"No Entry in cache for key {cacheKey}");

            var result = state.ToString();
            var moduleState = JsonSerializer.Deserialize<ModuleState>(result);

            if (moduleState is null)
                throw new Exception($"Invalid state in cache for key {cacheKey}");

            return moduleState;
        }
        catch (Exception ex)
        {
            logger.LogInformation("No or invalid state in cache for {key}: {@ex}", cacheKey, ex);
            return new ModuleState {ConnectionState = ConnectionState.NotConnected, ModuleType = Type, ModuleKey = Key};
        }
    }
    
    public virtual async Task<ModuleAutomationConfig> GetAutomationConfigAsync()
    {
        var state = await GetStateAsync();

        return new ModuleAutomationConfig
        {
            ConnectorKey = Key,
            ModuleType = Type,
            Min = state.Min,
            Max = state.Max,
            Unit = state.Unit,
            TsType = "number"
        };
    }
}

public abstract class BaseSensorApiModuleConnector(string key, IConnectionMultiplexer redis, ILogger logger) : BaseApiModuleConnector(key, redis, logger)
{
    public override Task<IEnumerable<ActionDefinition>> GetActionsAsync() => Task.FromResult((IEnumerable<ActionDefinition>) []);
}

public abstract class BaseActuatorApiModuleConnector(string key, IConnectionMultiplexer redis, ILogger logger) : BaseApiModuleConnector(key, redis, logger)
{
    public override async Task<IEnumerable<ActionDefinition>> GetActionsAsync()
    {
        var state = await GetStateAsync();

        return ConnectorActionsProviderFactory.GetActionsProvider(Type).GetActions(state);
    }
}