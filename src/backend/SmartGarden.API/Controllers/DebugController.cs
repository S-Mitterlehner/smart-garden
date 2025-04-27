using Microsoft.AspNetCore.Mvc;
using MQTTnet;
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
}