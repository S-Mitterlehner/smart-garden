namespace SmartGarden.Messaging.Messages;

public interface IMessage
{
    string Exchange { get; }
    string Queue { get; }
    string RoutingKey { get; }
    object Body { get; }
    string? CorrelationId { get; }
}