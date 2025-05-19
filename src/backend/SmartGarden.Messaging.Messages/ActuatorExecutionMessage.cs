namespace SmartGarden.Messaging.Messages;

public class ActuatorExecutionMessage(ActuatorExecutionMessageBody body) : IMessage<ActuatorExecutionMessageBody>
{
    public static string Exchange => "SmartGarden";
    public static string Queue => "SG-Execute";
    public static string RoutingKey => "ActuatorRoutingKey";
    public static ulong Expiration => 60_000;
    public object Body => Data;
    public string? CorrelationId => Data.ActuatorKey;
    public ActuatorExecutionMessageBody Data { get; set; } = body;
}