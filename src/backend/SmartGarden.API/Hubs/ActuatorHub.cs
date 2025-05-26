using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Listener;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.Hubs;

[Obsolete("Use ModuleHub instead")]
public class ActuatorHub : Hub
{
    public async Task SubscribeToActuator(string key, string type)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, SignalRActuatorListener.GetGroup(key, Enum.Parse<ModuleType>(type, true)));
    }

    public async Task UnsubscribeFromActuator(string key, string type)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, SignalRActuatorListener.GetGroup(key, Enum.Parse<ModuleType>(type, true)));
    }
}