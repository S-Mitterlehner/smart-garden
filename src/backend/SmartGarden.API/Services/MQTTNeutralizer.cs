using MQTTnet;
using SmartGarden.Sensors;

namespace SmartGarden.API.Services;

public class MQTTNeutralizer(IMqttClient client) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var message = new MqttApplicationMessageBuilder()
                      .WithTopic(SensorManager.RegisterTopic)
                      .WithPayload("")
                      .WithRetainFlag(true)
                      .Build();

        await client.PublishAsync(message, stoppingToken);
    }
}