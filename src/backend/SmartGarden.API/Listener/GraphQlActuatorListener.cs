using HotChocolate.Subscriptions;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;

namespace SmartGarden.API.Listener;

public class GraphQlActuatorListener(ITopicEventSender eventSender, ILogger<GraphQlActuatorListener> logger) : IActuatorListener
{
    public const string STATE_CHANGED = "Actuator_State";
    
    public async Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
    {
        logger.LogDebug("GraphQL ActuatorState Published: {data}", data);
        var dto = new ActuatorStateDto
        {
            Unit = data.Unit,
            Value = data.CurrentValue,
            Min = data.Min,
            Max = data.Max,
            State = data.State,
            StateType = data.StateType.ToString(),
            ConnectionState = data.ConnectionState.ToString(),
            ActuatorKey = data.ActuatorKey,
            ActuatorType = data.ActuatorType.ToString(),
            LastUpdate = data.LastUpdate,
            Actions = actions.AsQueryable().Select(ActuatorActionDto.FromEntity).ToList()
        };

        await eventSender.SendAsync(STATE_CHANGED, dto);
    }
}