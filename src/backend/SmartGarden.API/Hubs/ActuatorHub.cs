using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Listener;

namespace SmartGarden.API.Hubs;

public class ActuatorHub : Hub
{
    public async Task SubscribeToActuator(string key, string type)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, SignalRActuatorListener.GetGroup(key, type));
    }

    public async Task UnsubscribeFromActuator(string key, string type)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, SignalRActuatorListener.GetGroup(key, type));
    }
}