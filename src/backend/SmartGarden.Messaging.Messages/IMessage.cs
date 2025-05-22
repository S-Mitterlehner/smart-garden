using RabbitMQ.Client;

namespace SmartGarden.Messaging.Messages;

public interface IMessage
{
    abstract static string Exchange { get; }
    abstract static string Queue { get; }
    abstract static string RoutingKey { get; }
    abstract static ulong? Expiration { get; }
    abstract static DeliveryModes DeliveryMode { get; }
    
    object? Body { get; }
    string? CorrelationId { get; }
}

public interface IMessage<out TBody> : IMessage
{
    object? IMessage.Body => Data;
    TBody Data { get; }
}