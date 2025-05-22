using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Api;

public class RegisterModuleMessageHandler(IServiceProvider sp, IApiModuleManager manager, ILogger<RegisterModuleMessageHandler> logger)
    : IMessageHandler<RegisterModuleMessageBody>
{
    public async Task HandleAsync(RegisterModuleMessageBody msgBody)
    {
        var connector = await manager.GetConnectorAsync(new ModuleRefRecord(msgBody.ModuleKey, msgBody.ModuleType));
        
        await using var scope = sp.CreateAsyncScope();
        await using var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var reference = await db.Get<ModuleRef>()
            .FirstOrDefaultAsync(x => x.Id == msgBody.ModuleId);

        if (reference is null)
        {
            reference = db.New<ModuleRef>(msgBody.ModuleId);
            reference.Name = connector.Name;
            reference.Description = connector.Description;
            reference.ModuleKey = connector.Key;
            reference.Type = connector.Type;
        }

        await db.SaveChangesAsync();
        logger.LogDebug("Registered Module: {name} from type {type} with key {key}", connector.Name, connector.Type, connector.Key);
    }
}