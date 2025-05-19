using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using SmartGarden.Messaging.Messages;

namespace SmartGarden.Messaging;

public class RabbitMQMessagingProducer(IConnection rabbitConnection) : IMessagingProducer 
{
    public async Task SendAsync(IMessage msg)
    {
        await using var channel = await rabbitConnection.CreateChannelAsync();

        await channel.ExchangeDeclareAsync(msg.Exchange, ExchangeType.Direct, durable: true);
        await channel.QueueDeclareAsync(msg.Queue, durable: false, exclusive: false, autoDelete: false);
        await channel.QueueBindAsync(msg.Queue, msg.Exchange, msg.RoutingKey);

        var json = JsonSerializer.Serialize(msg.Body);
        var body = Encoding.UTF8.GetBytes(json);

        var props = new BasicProperties
        {
            CorrelationId = msg.CorrelationId
            , DeliveryMode = DeliveryModes.Transient
            , Expiration = "60000"
            , Priority = 5
        };

        await channel.BasicPublishAsync(msg.Exchange, msg.RoutingKey, true, props, body);
    }
}