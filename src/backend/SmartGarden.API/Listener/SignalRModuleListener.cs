using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Dtos.Module;
using SmartGarden.API.Hubs;
using SmartGarden.API.Listener.Legacy;
using SmartGarden.Modules;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.API.Listener;

public class SignalRModuleListener(IHubContext<ModuleHub> context, ILogger<SignalRSensorListener> logger) : IModuleListener
{
    public const string STATE_CHANGED = "Module_State";
    public static string GetGroup(string key, ModuleType type) => $"{STATE_CHANGED}_{key}_{type.ToString().ToUpper()}";

    public async Task PublishStateChangeAsync(ModuleState data, IEnumerable<ActionDefinition> actions)
    {
        logger.LogDebug("SignalR ModuleState Published: {@data}", data);
        var dto = new ModuleStateDto
        {
            Unit = data.Unit
            , Value = data.CurrentValue
            , Min = data.Min
            , Max = data.Max
            , State = data.State
            , StateType = data.StateType
            , ConnectionState = data.ConnectionState
            , ModuleKey = data.ModuleKey
            , ModuleType = data.ModuleType
            , LastUpdate = data.LastUpdate
            , Actions = actions.AsQueryable().Select(ModuleActionDto.FromEntity).ToList()
        };
        
        await context.Clients.Group(GetGroup(dto.ModuleKey, dto.ModuleType)).SendAsync(STATE_CHANGED, dto.ModuleKey, dto.ModuleType.ToString().ToUpper(), dto);
    }
}