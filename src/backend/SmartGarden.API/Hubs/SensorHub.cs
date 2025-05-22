using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Listener;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.Hubs;

public class SensorHub : Hub
{
    public async Task SubscribeToSensor(string key, string type)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, SignalRSensorListener.GetGroup(key, Enum.Parse<ModuleType>(type, true)));
    }

    public async Task UnsubscribeFromSensor(string key, string type)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, SignalRSensorListener.GetGroup(key, Enum.Parse<ModuleType>(type, true)));
    }
}