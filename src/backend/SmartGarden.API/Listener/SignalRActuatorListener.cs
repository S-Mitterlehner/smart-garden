using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Hubs;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.API.Listener;

public class SignalRActuatorListener(IHubContext<ActuatorHub> context, ILogger<SignalRSensorListener> logger) : IActuatorListener
{
    public const string STATE_CHANGED = "Actuator_State";
    public static string GetGroup(string key, string type) => $"{STATE_CHANGED}_{key}_{type}";

    public async Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
    {
        logger.LogDebug("SignalR ActuatorState Published: {data}", data);
        var dto = new ActuatorStateDto()
        {
            Unit = data.Unit
            , Value = data.CurrentValue
            , Min = data.Min
            , Max = data.Max
            , State = data.State
            , StateType = data.StateType.ToString()
            , ConnectionState = data.ConnectionState.ToString()
            , ActuatorKey = data.ActuatorKey
            , ActuatorType = data.ActuatorType.ToString()
            , LastUpdate = data.LastUpdate
            , Actions = actions.AsQueryable().Select(ActuatorActionDto.FromEntityOld).ToList()
        };
        
        await context.Clients.Group(GetGroup(dto.ActuatorKey, dto.ActuatorType)).SendAsync(STATE_CHANGED, dto.ActuatorKey, dto.ActuatorType, dto);
    }
}