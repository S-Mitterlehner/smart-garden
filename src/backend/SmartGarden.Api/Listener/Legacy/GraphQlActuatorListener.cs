using HotChocolate.Subscriptions;
using SmartGarden.Api.Dtos.Actuator;
using SmartGarden.Legacy;
using SmartGarden.Modules.Enums;
using ActionDefinition = SmartGarden.Legacy.ActionDefinition;

namespace SmartGarden.Api.Listener.Legacy;

[Obsolete("Use GraphQlModuleListener instead")]
public class GraphQlActuatorListener(ITopicEventSender eventSender, ILogger<GraphQlActuatorListener> logger) : IActuatorListener
{
    public static string GetTopic(string key, ModuleType type) => $"Actuator_State_{key}_{type}";

    public async Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
    {
        logger.LogDebug("GraphQL ActuatorState Published: {@data}", data);
        var dto = new ActuatorStateDto
        {
            Unit = data.Unit,
            Value = data.CurrentValue,
            Min = data.Min,
            Max = data.Max,
            State = data.State,
            StateType = data.StateType,
            ConnectionState = data.ConnectionState,
            ActuatorKey = data.ActuatorKey,
            ActuatorType = data.ActuatorType,
            LastUpdate = data.LastUpdate,
            Actions = actions.AsQueryable().Select(ActuatorActionDto.FromEntityOld).ToList()
        };

        await eventSender.SendAsync(GetTopic(dto.ActuatorKey, dto.ActuatorType), dto);
    }
}