using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SmartGarden.Modules.Enums;
using System.Collections.Concurrent;
using SmartGarden.Modules.Api.Connectors;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Api;

public class ApiModuleManager(IServiceProvider sp, IOptions<ModuleSettings> settings) : IApiModuleManager
{
    private readonly ConcurrentDictionary<string, IApiModuleConnector> _connectors = new();

    public Task<IApiModuleConnector> GetConnectorAsync(IModuleRef reference)
        => Task.FromResult(GetConnectorFromList(reference.ModuleKey, reference.Type) ?? CreateConnector(reference));
    
    private IApiModuleConnector? GetConnectorFromList(string key, ModuleType type) 
        => _connectors.GetValueOrDefault(GetDictKey(key, type));

    private IApiModuleConnector CreateConnector(IModuleRef reference)
    {
        var connector = CreateConnectorInstance(reference.ModuleKey, reference.Type);

        _connectors.TryAdd(GetDictKey(reference.ModuleKey, reference.Type), connector);

        return connector;
    }
    private string GetDictKey(string key, ModuleType type) => $"{key}-{type}";

    private IApiModuleConnector CreateConnectorInstance(string key, ModuleType type)
    {
        return type switch
        {
            ModuleType.Temperature => ActivatorUtilities.CreateInstance<TemperatureModuleConnector>(sp, key),
            ModuleType.Humidity => ActivatorUtilities.CreateInstance<HumidityModuleConnector>(sp, key),
            ModuleType.Moisture => ActivatorUtilities.CreateInstance<MoistureModuleConnector>(sp, key),
            ModuleType.Pump => ActivatorUtilities.CreateInstance<PumpModuleConnector>(sp, key),
            ModuleType.Hatch => ActivatorUtilities.CreateInstance<HatchModuleConnector>(sp, key),
            _ => throw new ModuleTypeNotFoundException(type)
        };
    }
}