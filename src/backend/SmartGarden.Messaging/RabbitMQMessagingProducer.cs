using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using SmartGarden.Messaging.Messages;

namespace SmartGarden.Messaging;

public class RabbitMQMessagingProducer(IConnection rabbitConnection) : IMessagingProducer 
{
    public async Task SendAsync<T>(T msg) where T : IMessage
    {
        await using var channel = await rabbitConnection.CreateChannelAsync();

        await channel.ExchangeDeclareAsync(T.Exchange, ExchangeType.Topic, durable: true);
        await channel.QueueDeclareAsync(T.Queue, durable: true, exclusive: false, autoDelete: false);
        await channel.QueueBindAsync(T.Queue, T.Exchange, T.RoutingKey);

        var json = JsonSerializer.Serialize(msg.Body);
        var body = Encoding.UTF8.GetBytes(json);

        var props = new BasicProperties
        {
            CorrelationId = msg.CorrelationId
            , DeliveryMode = DeliveryModes.Transient
            , Expiration = T.Expiration.ToString()
            , Priority = 5
        };

        await channel.BasicPublishAsync(T.Exchange, T.RoutingKey, true, props, body);
    }
}