using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SmartGarden.Messaging.Messages;
using SmartGarden.Messaging.Models;

namespace SmartGarden.Messaging;

public class MessagingListenerService<TMessage, TBody>(
    IConnection conn, 
    IOptions<RabbitMQSettings> settings, 
    IMessageHandler<TBody> handler, 
    ILogger<MessagingListenerService<TMessage, TBody>> logger) 
    : BackgroundService 
    where TMessage : IMessage<TBody>
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var channel = await conn.CreateChannelAsync(cancellationToken: stoppingToken);
        var queueName = TMessage.GetQueueName(settings.Value.AppId);
        
        await channel.ExchangeDeclareAsync(TMessage.Exchange, ExchangeType.Direct, durable: true, cancellationToken: stoppingToken);
        await channel.QueueDeclareAsync(queueName, durable: true, exclusive: false, autoDelete: false, cancellationToken: stoppingToken);
        await channel.QueueBindAsync(queueName, TMessage.Exchange, string.Empty, cancellationToken: stoppingToken);

        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            try
            {
                var body = ea.Body.ToArray();
                var json = Encoding.UTF8.GetString(body);

                logger.LogInformation("Received message: {msg}", json);

                var msgBody = JsonSerializer.Deserialize<TBody>(json);

                if (msgBody == null)
                {
                    logger.LogError("Failed to deserialize message: {msg}", json);
                    return;
                }

                logger.LogInformation("Handle message: {msg}", json);

                await handler.HandleAsync(msgBody);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing message");
            }
        };

        await channel.BasicConsumeAsync(queue: queueName, 
                                        autoAck: true, 
                                        consumer: consumer, 
                                        cancellationToken: stoppingToken);
    }
}