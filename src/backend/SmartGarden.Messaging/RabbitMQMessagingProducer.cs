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

        await channel.ExchangeDeclareAsync(T.Exchange, ExchangeType.Direct, durable: true);
        
        var json = JsonSerializer.Serialize(msg.Body);
        var body = Encoding.UTF8.GetBytes(json);

        var props = new BasicProperties
        {
            CorrelationId = msg.CorrelationId
            , DeliveryMode = T.DeliveryMode
            , Expiration = T.Expiration?.ToString()
            , Priority = 5
            , 
        };

        await channel.BasicPublishAsync(T.Exchange, string.Empty, true, props, body);
    }
}