using Microsoft.AspNetCore.Mvc;
using MQTTnet;
using RulesEngine.Models;
using SmartGarden.Actuators;
using SmartGarden.Sensors;

namespace SmartGarden.API.Controllers;

public class DebugController(IMqttClient client) : BaseController
{
    [HttpHead("neutralize-retains")]
    public async Task<IActionResult> NeutralizeMqttQueues()
    {
        var message = new MqttApplicationMessageBuilder()
                      .WithTopic(SensorManager.RegisterTopic)
                      .WithPayload("")
                      .WithRetainFlag(true)
                      .Build();

        await client.PublishAsync(message);
        
        message = new MqttApplicationMessageBuilder()
                      .WithTopic(ActuatorManager.RegisterTopic)
                      .WithPayload("")
                      .WithRetainFlag(true)
                      .Build();

        await client.PublishAsync(message);

        return Ok();
    }
    [HttpGet("rule-test")]
    public async Task<IActionResult> CheckRules()
    {
        
        var rules = new List<Rule>();

        var rule = new Rule
        {
            RuleName = "Test-Rule",
            SuccessEvent = "RUN",
            ErrorMessage = "Nope",
            Expression = "sm_1234.value > 10",
            RuleExpressionType = RuleExpressionType.LambdaExpression
        };
        rules.Add(rule);

        var wf = new Workflow
        {
            WorkflowName = "Test-Workflow",
            Rules = rules
        };

        var result = new RulesEngine.RulesEngine([wf]);
        var input = new { sm_1234 = new { value = 16 } };
        var workflowResult = result.ExecuteAllRulesAsync("Test-Workflow", input).Result;

        return Ok(workflowResult);
    }
}