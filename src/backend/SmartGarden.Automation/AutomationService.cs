using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;
using SmartGarden.Automation.RulesEngine;
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
    public async Task Execute(IJobExecutionContext context)
    {
        logger.LogInformation("AutomationService - Execute");
        await using var scope = sp.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
        
        var rules = await db.Get<AutomationRule>().Where(x => x.IsEnabled).ToListAsync();

        if (!rules.Any())
            return;
        
        var parameters = new List<RuleParameter>();
        parameters.Add(new RuleParameter("CurrentTime", DateTime.Now.TimeOfDay));

        var sensors = await db.Get<SensorRef>().ToListAsync();
        foreach (var sensor in sensors)
        {
            var connector = await sensorManager.GetConnectorAsync(sensor);
            var sensorData = await connector.GetDataAsync();
        
            parameters.Add(new RuleParameter($"{sensor.ConnectorKey.Replace("-", "_")}.{sensor.Type}", sensorData.CurrentValue));
        }

        var actuators = await db.Get<ActuatorRef>().ToListAsync();
        foreach (var actuator in actuators)
        {
            var connector = await actuatorManager.GetConnectorAsync(actuator);
            var state = await connector.GetStateAsync();

            parameters.Add(new RuleParameter($"{actuator.ConnectorKey.Replace("-", "_")}.{actuator.Type}", state.StateType == StateType.Discrete ? state.State : state.CurrentValue));
        }

        var lastRunParam = new RuleParameter("ElapsedTimeSinceLastRun", DateTime.Now);
        parameters.Add(lastRunParam);
        foreach (var rule in rules)
        {
            lastRunParam.Value = DateTime.Now - (rule.LastActionRunAt ?? DateTime.Now);
            var evaluator = RulesEngine.RulesEngine.Parse(rule.Expression);
            var ruleResult = evaluator.Evaluate(parameters);

            logger.LogInformation("RuleCheck - {expression}: {IsSuccess} ({parameters})", 
                                  ruleResult.Rule, 
                                  ruleResult.IsSuccess,
                                  JsonConvert.SerializeObject(parameters));

            await executor.ExecuteActionsAsync(rule.Actions);
        }
    }
}