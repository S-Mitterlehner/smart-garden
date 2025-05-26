using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Listener;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.Hubs;

public class ModuleHub : Hub
{
    public async Task SubscribeToModule(string key, string type)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, SignalRModuleListener.GetGroup(key, Enum.Parse<ModuleType>(type, true)));
    }

    public async Task UnsubscribeFromModule(string key, string type)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, SignalRModuleListener.GetGroup(key, Enum.Parse<ModuleType>(type, true)));
    }
}