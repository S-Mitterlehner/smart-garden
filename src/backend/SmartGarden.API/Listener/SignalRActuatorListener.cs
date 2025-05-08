using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Hubs;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.API.Listener;

public class ActuatorListenerComposition(params IActuatorListener[] listeners) : IActuatorListener
{
    public async Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
    {
        foreach (var l in listeners)
        {
            await l.PublishStateChangeAsync(data, actions);
        }
    }
}

public class SignalRActuatorListener(IHubContext<ActuatorHub> context, ILogger<SignalRSensorListener> logger) : IActuatorListener
{
    public const string STATE_CHANGED = "Actuator_State";

    public async Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
    {
        logger.LogDebug("ActuatorState Published: {data}", data);
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
            , Actions = actions.AsQueryable().Select(ActuatorActionDto.FromEntity).ToList()
        };
        
        await context.Clients.All.SendAsync(STATE_CHANGED, data.ActuatorKey, data.ActuatorType.ToString(), dto);
    }
}