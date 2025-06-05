using Microsoft.AspNetCore.SignalR;
using SmartGarden.Api.Beds.Dtos.Module;
using SmartGarden.Api.Beds.Hubs;
using SmartGarden.Api.Beds.Listener.Legacy;
using SmartGarden.Modules;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Api.Beds.Listener;

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