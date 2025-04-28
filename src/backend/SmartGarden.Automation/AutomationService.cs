using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;
using SmartGarden.Automation.RulesEngine;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Sensors;

namespace SmartGarden.Automation;

public class AutomationService(
    ILogger<AutomationService> logger,
    ISensorManager sensorManager, 
    ActionExecutor executor, 
    IServiceProvider sp) 
    : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        logger.LogInformation("AutomationService - Execute");
        await using var scope = sp.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
        
        var parameters = new List<RuleParameter>();
        parameters.Add(new RuleParameter("CurrentTime", DateTime.Now.TimeOfDay));

        var sensors = await db.Get<SensorRef>().ToListAsync();
        foreach (var sensor in sensors)
        {
            var connector = await sensorManager.GetConnectorAsync(sensor);
            if (connector == null)
                continue;
            
            var sensorData = await connector.GetDataAsync();
        
            parameters.Add(new RuleParameter($"{sensor.ConnectorKey.Replace("-", "_")}.{sensor.Type}", sensorData.CurrentValue));
        }

        var rules = await db.Get<AutomationRule>().ToListAsync();

        foreach (var rule in rules)
        {
            var evaluator = RulesEngine.RulesEngine.Parse(rule.Expression);
            var ruleResult = evaluator.Evaluate(parameters);

            logger.LogInformation("RuleCheck - {expression}: {IsSuccess} ({parameters})", 
                                  ruleResult.Rule, 
                                  ruleResult.IsSuccess,
                                  JsonConvert.SerializeObject(parameters));
        }
    }
}