using Microsoft.AspNetCore.SignalR;
using SmartGarden.Api.Beds.Dtos.Actuator;
using SmartGarden.Api.Beds.Hubs;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Api.Beds.Listener.Legacy;

[Obsolete("Use SignalRModuleListener instead")]
public class SignalRActuatorListener(IHubContext<ActuatorHub> context, ILogger<SignalRSensorListener> logger) : IActuatorListener
{
    public const string STATE_CHANGED = "Actuator_State";
    public static string GetGroup(string key, ModuleType type) => $"{STATE_CHANGED}_{key}_{type}";

    public async Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
    {
        logger.LogDebug("SignalR ActuatorState Published: {@data}", data);
        var dto = new ActuatorStateDto
        {
            Unit = data.Unit
            , Value = data.CurrentValue
            , Min = data.Min
            , Max = data.Max
            , State = data.State
            , StateType = data.StateType
            , ConnectionState = data.ConnectionState
            , ActuatorKey = data.ActuatorKey
            , ActuatorType = data.ActuatorType
            , LastUpdate = data.LastUpdate
            , Actions = actions.AsQueryable().Select(ActuatorActionDto.FromEntityOld).ToList()
        };
        
        await context.Clients.Group(GetGroup(dto.ActuatorKey, dto.ActuatorType)).SendAsync(STATE_CHANGED, dto.ActuatorKey, dto.ActuatorType, dto);
    }
}