namespace SmartGarden.Messaging.Messages;

public interface IMessage
{
    static abstract string Exchange { get; }
    static abstract string Queue { get; }
    static abstract string RoutingKey { get; }
    static abstract ulong Expiration { get; }
    
    object? Body { get; }
    string? CorrelationId { get; }
}

public interface IMessage<out TBody> : IMessage
{
    object? IMessage.Body => Data;
    TBody Data { get; }
}