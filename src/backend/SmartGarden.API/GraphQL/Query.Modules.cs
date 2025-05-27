using LinqKit;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos.Module;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Api;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.GraphQL;

public partial class Query
{
    [UseFiltering]
    public async Task<IEnumerable<ModuleRefDto>> GetModules(ModuleGroup group, [Service] ApplicationDbContext db) =>
        await db.Get<ModuleRef>()
                .Where(x => ModuleTypeExpressions.Group.Invoke(x.Type) == group)
                .Select(ModuleRefDto.FromEntity)
                .ToListAsync();

    [UseFiltering]
    public async Task<ModuleDto?> GetModule(Guid id, [Service] ApplicationDbContext db, [Service] IApiModuleManager moduleManager)
    {
        var reference = await db.Get<ModuleRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) return null;
        var connector = await moduleManager.GetConnectorAsync(reference);
        var state = await connector.GetStateAsync();
        return new ModuleDto
        {
            Id = reference.Id
            , Name = reference.Name
            , Key = reference.ModuleKey
            , Type = reference.Type
            , Description = connector.Description
            , State = ModuleStateDto.FromState(state, await connector.GetActionsAsync())
        };
    }
}