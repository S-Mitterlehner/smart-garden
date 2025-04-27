using Microsoft.EntityFrameworkCore;
using Quartz;
using RulesEngine.Models;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Sensors;

namespace SmartGarden.Automation;

public class AutomationService(
    ApplicationContext db, 
    SensorManager sensorManager, 
    ActionExecutor executor, 
    IServiceProvider sp) 
    : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var beds = await db.Get<Bed>().ToListAsync();

        var engine = new RulesEngine.RulesEngine();

        var sensors = await db.Get<SensorRef>().ToListAsync();
        
        var parameters = new List<ScopedParam>();
        
        parameters.Add(new ScopedParam
        {
            Name = "CurrentTime",
            Expression = DateTime.Now.ToString("HH:mm:ss")
        });

        foreach (var sensor in sensors)
        {
            var connector = await sensorManager.GetConnectorAsync(sensor);
            if (connector == null)
                continue;
            
            var sensorData = await connector.GetDataAsync();

            var p = new ScopedParam
            {
                Name = $"{sensor.ConnectorKey.Replace("-", "_")}.{sensor.Type}",
                Expression = sensorData.CurrentValue.ToString(),
            };
            
            parameters.Add(p);
        }

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
            var result = await engine.ExecuteAllRulesAsync(wfName, parameters);

            foreach (var ruleResult in result)
            {
                Console.WriteLine($"{ruleResult.Rule.RuleName}: {ruleResult.IsSuccess}");
            }
        }
        
    }
}