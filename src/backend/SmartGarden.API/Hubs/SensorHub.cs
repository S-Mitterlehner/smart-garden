using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Listener;

namespace SmartGarden.API.Hubs;

public class SensorHub : Hub
{
    public async Task SubscribeToSensor(string key, string type)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, SignalRSensorListener.GetGroup(key, type));
    }

    public async Task UnsubscribeFromSensor(string key, string type)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, SignalRSensorListener.GetGroup(key, type));
    }

    
}