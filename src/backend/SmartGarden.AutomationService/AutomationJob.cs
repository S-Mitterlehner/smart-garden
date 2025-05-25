using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Json.Logic;
using Json.More;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;
using SmartGarden.AutomationService.EntityFramework;
using SmartGarden.AutomationService.EntityFramework.Models;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.AutomationService;

public class AutomationJob(
    ILogger<AutomationJob> logger,
    ActionExecutor executor,
    IMemoryCache cache,
    IServiceProvider sp) 
    : IJob
{
    private const string CURRENT_TIME = "CurrentTime";

    private static readonly Regex TimeRegex = new(@"""(?<hour>\d{1,2}):(?<minute>\d{1,2}):(?<second>\d{1,2})""");

    public async Task Execute(IJobExecutionContext context)
    {
        logger.LogDebug("AutomationService - Execute");
        await using var scope = sp.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AutomationServiceDbContext>();
        
        var rules = await db.Get<AutomationRule>()
                            .Where(x => x.IsEnabled && DateTime.UtcNow - (x.LastActionRunAt ?? DateTime.MinValue) > x.CoolDown)
                            .ToListAsync();

        if (!rules.Any())
        {
            logger.LogInformation("No rules to check");
            return;
        }

        var parameters = new JsonObject {{CURRENT_TIME, DateTime.UtcNow.TimeOfDay.Ticks}};

        var modules = await db.Get<ModuleRef>().GroupBy(x => x.ModuleKey).ToListAsync();
        foreach (var module in modules)
        {
            if (!(parameters.TryGetPropertyValue(module.Key, out var node) && node is JsonObject actuatorObj))
            {
                actuatorObj = new JsonObject();
                parameters.Add(module.Key, actuatorObj);
            }

            foreach (var reference in module.ToList())
            {
                var state = cache.Get<ModuleState>(AutomationUtils.GetCacheKey(reference.ModuleKey, reference.Type));

                if (state is null)
                {
                    logger.LogWarning("No state for module {moduleKey}/{type}", reference.ModuleKey, reference.Type);
                    continue;
                }

                actuatorObj.Add(reference.Type.ToString(), state.StateType == StateType.Discrete ? state.State : state.CurrentValue);
            }
        }

        foreach (var rule in rules)
        {
            try
            {
                var json = ReplaceTime(rule.ExpressionJson);
                var expression = JsonNode.Parse(json);

                var result = JsonLogic.Apply(expression, parameters)?.GetValue<bool>() ?? false;

                logger.LogInformation("RuleCheck - {expression}: {IsSuccess} ({parameters})",
                                      rule.ExpressionJson,
                                      result,
                                      parameters.AsJsonString());

                if (result)
                {
                    await executor.ExecuteActionsAsync(rule.Actions);

                    rule.LastActionRunAt = DateTime.UtcNow;
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error executing rule {ruleId}: {message}", rule.Id, ex.Message);
            }
        }
    }

    private static string ReplaceTime(string json)
    {
        var matches = TimeRegex.Matches(json);

        foreach (Match match in matches)
        {
            var hour = match.Groups["hour"].Value;
            var minute = match.Groups["minute"].Value;
            var second = match.Groups["second"].Value;
            var time = new TimeSpan(int.Parse(hour), int.Parse(minute), int.Parse(second));
            json = json.Replace(match.Value, time.Ticks.ToString());
        }

        return json;
    }
}