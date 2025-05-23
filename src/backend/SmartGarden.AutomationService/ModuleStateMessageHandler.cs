using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SmartGarden.Automation;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;

namespace SmartGarden.AutomationService;

public class ModuleStateMessageHandler(IMemoryCache cache, ILogger<ModuleStateMessageHandler> logger) : IMessageHandler<ModuleStateMessageBody>
{
    public Task HandleAsync(ModuleStateMessageBody msgBody)
    {
        cache.Set(AutomationUtils.GetCacheKey(msgBody.ModuleKey, msgBody.ModuleType), 
            msgBody, 
            TimeSpan.FromMinutes(5)); //TODO: from settings

        logger.LogDebug("Module State for {key}/{type} updated: {@state}", msgBody.ModuleKey, msgBody.ModuleType, msgBody);
        return Task.CompletedTask;
    }
}