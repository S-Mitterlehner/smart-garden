using LinqKit;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos.Module;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Api;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.GraphQL;

public partial class Mutation
{
    public async Task<ModuleRefDto?> UpdateModuleRef([ID] Guid id, string? name, string? description,
                                                     [Service] ApplicationDbContext db)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) throw new GraphQLException("Module not found.");
        if (name is not null) reference.Name = name;
        if (description is not null) reference.Description = description;
        await db.SaveChangesAsync();
        return ModuleRefDto.FromEntity.Invoke(reference);
    }

    public async Task<bool> ExecuteModuleAction([ID] Guid id, string actionKey, double? value,
                                                [Service] ApplicationDbContext db,
                                                [Service] IApiModuleManager ModuleManager,
                                                [Service] IMessagingProducer messaging)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) return false;
        var connector = await ModuleManager.GetConnectorAsync(reference);
        var action = await connector.GetActionDefinitionByKeyAsync(actionKey);
        if (action == null) throw new GraphQLException("Action not found.");
        if (action.ActionType == ActionType.Value && value == null)
            throw new GraphQLException("This action requires a value.");
        var execution = new ActionExecutionMessageBody {ModuleKey = connector.Key, ModuleType = (int) connector.Type, ActionKey = actionKey, Value = value};
        await messaging.SendAsync(new ActionExecutionMessage(execution));
        return true;
    }

    public async Task<ModuleRefDto> AddModuleToBed([ID] Guid bedId, [ID] Guid ModuleId,
                                                   [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        if (bed.Modules.Any(a => a.Id == ModuleId))
            throw new GraphQLException("Module already added to this bed");
        var Module = await db.Get<ModuleRef>().FirstOrDefaultAsync(a => a.Id == ModuleId);
        if (Module == null)
            throw new GraphQLException($"Module with id {ModuleId} not found");
        bed.Modules.Add(Module);
        await db.SaveChangesAsync();
        return ModuleRefDto.FromEntity.Invoke(Module);
    }

    public async Task<bool> RemoveModuleFromBed([ID] Guid bedId, [ID] Guid ModuleId,
                                                [Service] ApplicationDbContext db)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(b => b.Id == bedId);
        if (bed == null)
            throw new GraphQLException($"Bed with id {bedId} not found");
        var Module = await db.Get<ModuleRef>().FirstOrDefaultAsync(a => a.Id == ModuleId);
        if (Module == null)
            throw new GraphQLException($"Module with id {ModuleId} not found");
        bed.Modules.Remove(Module);
        await db.SaveChangesAsync();
        return true;
    }
}