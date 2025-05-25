using Microsoft.EntityFrameworkCore;
using SmartGarden.AutomationService.EntityFramework;
using SmartGarden.AutomationService.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules.Enums;

namespace SmartGarden.AutomationService.MessageHandler;

public class ModuleRegisterMessageHandler(AutomationServiceDbContext db) : IMessageHandler<ModuleRegisterMessageBody>
{
    public async Task HandleAsync(ModuleRegisterMessageBody msgBody)
    {
        var existing = await db.Get<ModuleRef>().AnyAsync(x => x.Id == msgBody.ModuleId);

        if (existing) return;


        var entity = db.New<ModuleRef>(msgBody.ModuleId);
        entity.ModuleKey = msgBody.ModuleKey;
        entity.Type = (ModuleType) msgBody.ModuleType;

        await db.SaveChangesAsync();
    }
}