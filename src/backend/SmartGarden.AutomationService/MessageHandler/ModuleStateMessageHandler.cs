using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SmartGarden.AutomationService.EntityFramework;
using SmartGarden.AutomationService.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.AutomationService.MessageHandler;

public class ModuleStateMessageHandler(IServiceProvider sp, IMemoryCache cache, ILogger<ModuleStateMessageHandler> logger) : IMessageHandler<ModuleStateMessageBody>
{
    public async Task HandleAsync(ModuleStateMessageBody msgBody)
    {
        using var scope = sp.CreateScope();
        await using var db = scope.ServiceProvider.GetRequiredService<AutomationServiceDbContext>();

        var moduleType = Enum.Parse<ModuleType>(msgBody.ModuleType, true);
        var module = await db.Get<ModuleRef>().FirstAsync(x => x.ModuleKey == msgBody.ModuleKey && x.Type == moduleType);

        var state = new ModuleState
        {
            CurrentValue = msgBody.CurrentValue
            , StateType = Enum.Parse<StateType>(msgBody.StateType, true)
            , State = msgBody.State
            , Min = msgBody.Min
            , Max = msgBody.Max
            , Unit = msgBody.Unit
            , LastUpdate = DateTime.UtcNow
        };

        cache.Set(AutomationUtils.GetCacheKey(msgBody.ModuleKey, msgBody.ModuleType), 
            state, 
            TimeSpan.FromMinutes(5)); //TODO: from settings

        logger.LogDebug("Module State for {key}/{type} updated: {@state}", msgBody.ModuleKey, msgBody.ModuleType, msgBody);
    }
}