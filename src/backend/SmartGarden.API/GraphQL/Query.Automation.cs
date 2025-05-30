using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos.Automation;
using SmartGarden.API.Helper;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Api;
using SmartGarden.Modules.Models;

namespace SmartGarden.API.GraphQL;

public partial class Query
{
    public async Task<AutomationConfigDto?> GetAutomationConfig(Guid bedId,
        [Service] ApplicationDbContext db,
        [Service] IApiModuleManager moduleManager)
    {
        var bed = await db.Get<Bed>().FirstOrDefaultAsync(x => x.Id == bedId);
        if (bed == null) throw new GraphQLException("Bed not found");

        var moduleConfig = new List<AutomationConfig>();

        foreach (var sensor in bed.Modules)
        {
            var connector = await moduleManager.GetConnectorAsync(sensor);
            moduleConfig.Add(await connector.GetAutomationConfigAsync());
        }

        moduleConfig.AddRange(AutomationHelper.GetMiscAutomationConfig());

        var parameters = moduleConfig.AsQueryable().GroupBy(x => x.Group).Select(g => new ParameterGroupDto
        {
            Key = g.Key.Replace("-", "_"),
            Label = g.Key.Replace("_", "-"),
            Fields = g.AsQueryable().Select(ParameterFieldDto.FromModel).ToList()
        }).ToList();

        return new AutomationConfigDto
        {
            Parameters = parameters
        };
    }
    
    public async Task<IEnumerable<AutomationRuleDto>> GetRules(Guid bedId, [Service] ApplicationDbContext db) =>
        await db.Get<AutomationRule>()
            .Where(x => x.BedId == bedId)
            .Select(AutomationRuleDto.FromEntity)
            .ToListAsync();
    
    public async Task<AutomationRuleDto?> GetRule(Guid ruleId, [Service] ApplicationDbContext db) =>
        await db.Get<AutomationRule>()
            .Where(x => x.Id == ruleId)
            .Select(AutomationRuleDto.FromEntity)
            .FirstOrDefaultAsync();
}