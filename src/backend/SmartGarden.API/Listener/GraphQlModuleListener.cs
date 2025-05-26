using HotChocolate.Subscriptions;
using SmartGarden.API.Dtos.Module;
using SmartGarden.Modules;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.API.Listener;

public class GraphQlModuleListener(ITopicEventSender eventSender, ILogger<GraphQlModuleListener> logger) : IModuleListener
{
    public static string GetTopic(string key, ModuleType type) => $"Module_State_{key}_{type}";

    public async Task PublishStateChangeAsync(ModuleState data, IEnumerable<ActionDefinition> actions)
    {
        logger.LogDebug("GraphQL ModuleState Published: {@data}", data);
        var dto = new ModuleStateDto
        {
            Unit = data.Unit,
            Value = data.CurrentValue,
            Min = data.Min,
            Max = data.Max,
            State = data.State,
            StateType = data.StateType,
            ConnectionState = data.ConnectionState,
            ModuleKey = data.ModuleKey,
            ModuleType = data.ModuleType,
            LastUpdate = data.LastUpdate,
            Actions = actions.AsQueryable().Select(ModuleActionDto.FromEntity).ToList()
        };

        await eventSender.SendAsync(GetTopic(dto.ModuleKey, dto.ModuleType), dto);
    }
}