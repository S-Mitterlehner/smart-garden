using System.Dynamic;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;
using RulesEngine.Models;
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
        
        var beds = await db.Get<Bed>().ToListAsync();
        
        var parameters = new List<RuleParameter>();
        parameters.Add(new RuleParameter("CurrentTime", DateTime.Now.TimeOfDay));

        var sensors = await db.Get<SensorRef>().ToListAsync();
        var parameterDict = new Dictionary<string, dynamic>();
        foreach (var sensor in sensors)
        {
            var connector = await sensorManager.GetConnectorAsync(sensor);
            if (connector == null)
                continue;
            
            var sensorData = await connector.GetDataAsync();
        
            if (!parameterDict.TryGetValue(sensor.ConnectorKey, out dynamic subParams))
            {
                subParams = new ExpandoObject();
                parameterDict.Add(sensor.ConnectorKey, subParams);
            }

            ((IDictionary<string, object>)subParams)[sensor.Type.ToString()] = sensorData.CurrentValue;
        }

        parameters.AddRange(parameterDict.Select(pair => new RuleParameter(pair.Key.Replace("-", "_"), pair.Value)));
        var engine = new RulesEngine.RulesEngine();

        foreach (var bed in beds)
        {
            var wfName = bed.Id.ToString();
            var wf = new Workflow
            {
                WorkflowName = wfName,
                Rules = bed.Rules.Select(r => new Rule
                {
                    RuleName = r.Id.ToString(),
                    Expression = r.Expression
                })
            };
            engine.AddWorkflow(wf);
            var result = await engine.ExecuteAllRulesAsync(wfName, parameters.ToArray());

            foreach (var ruleResult in result)
            {
                logger.LogInformation("RuleCheck - {expression}: {IsSuccess} ({parameters})", 
                    ruleResult.Rule.Expression, 
                    ruleResult.IsSuccess,
                    JsonConvert.SerializeObject(parameters));
            }
        }
    }
}

public class SensorData
{
    public int Temperature { get; set; }
}