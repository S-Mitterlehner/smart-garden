using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Json.Logic;
using Json.More;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Enums;
using SmartGarden.Modules.Sensors;

namespace SmartGarden.Automation;

public class AutomationService(
    ILogger<AutomationService> logger,
    ISensorManager sensorManager, 
    IActuatorManager actuatorManager,
    ActionExecutor executor, 
    IServiceProvider sp) 
    : IJob
{
    private const string CURRENT_TIME = "CurrentTime";

    private static readonly Regex TimeRegex = new(@"""(?<hour>\d{1,2}):(?<minute>\d{1,2}):(?<second>\d{1,2})""");

    public async Task Execute(IJobExecutionContext context)
    {
        logger.LogInformation("AutomationService - Execute");
        await using var scope = sp.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
        
        var rules = await db.Get<AutomationRule>()
                            .Where(x => x.IsEnabled && DateTime.UtcNow - (x.LastActionRunAt ?? DateTime.MinValue) > x.CoolDown)
                            .ToListAsync();

        if (!rules.Any())
            return;

        var parameters = new JsonObject {{CURRENT_TIME, DateTime.UtcNow.TimeOfDay.Ticks}};
        var sensors = await db.Get<SensorRef>().GroupBy(x => x.ConnectorKey).ToListAsync();

        foreach (var sensor in sensors)
        {
            if (!(parameters.TryGetPropertyValue(sensor.Key, out var node) && node is JsonObject sensorObj))
            {
                sensorObj = new JsonObject();
                parameters.Add(sensor.Key, sensorObj);
            }

            foreach (var reference in sensor.ToList())
            {
                var connector = await sensorManager.GetConnectorAsync(reference);
                var sensorData = await connector.GetDataAsync();

                sensorObj.Add(reference.Type.ToString(), sensorData.CurrentValue);
            }
        }

        var actuators = await db.Get<ActuatorRef>().GroupBy(x => x.ConnectorKey).ToListAsync();
        foreach (var actuator in actuators)
        {
            if (!(parameters.TryGetPropertyValue(actuator.Key, out var node) && node is JsonObject actuatorObj))
            {
                actuatorObj = new JsonObject();
                parameters.Add(actuator.Key, actuatorObj);
            }

            foreach (var reference in actuator.ToList())
            {
                var connector = await actuatorManager.GetConnectorAsync(reference);
                var state = await connector.GetStateAsync();
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