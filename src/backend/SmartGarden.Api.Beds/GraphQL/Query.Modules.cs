using LinqKit;
using Microsoft.EntityFrameworkCore;
using SmartGarden.Api.Beds.Dtos.Module;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Models;
using SmartGarden.Modules.Api;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Api.Beds.GraphQL;

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
    
    [UseFiltering]
    public async Task<IEnumerable<ModuleDto?>> GetModulesInformation(
        [Service] ApplicationDbContext db,
        [Service] IApiModuleManager moduleManager)
    {
        var references = await db.Get<ModuleRef>().ToListAsync();

        var moduleDtos = await Task.WhenAll(references.Select(async r =>
        {
            if (r == null) return null;

            var connector = await moduleManager.GetConnectorAsync(r);
            var state = await connector.GetStateAsync();
            var actions = await connector.GetActionsAsync();

            return new ModuleDto
            {
                Id = r.Id,
                Name = r.Name,
                Key = r.ModuleKey,
                Type = r.Type,
                Description = connector.Description,
                State = ModuleStateDto.FromState(state, actions)
            };
        }));

        return moduleDtos;
    }
}