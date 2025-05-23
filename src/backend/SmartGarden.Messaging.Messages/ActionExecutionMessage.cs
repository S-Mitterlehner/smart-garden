using RabbitMQ.Client;

namespace SmartGarden.Messaging.Messages;

public class ActionExecutionMessage(ActionExecutionMessageBody body) : IMessage<ActionExecutionMessageBody>
{
    public static string Exchange => "ActionExecution_Exchange";
    public static ulong? Expiration => 60_000;
    public static DeliveryModes DeliveryMode => DeliveryModes.Transient;
    public static string GetQueueName(string clientId) => $"{clientId}_ActionExecution_Queue";

    public object Body => Data;
    public string? CorrelationId => Data.ActuatorKey;
    public ActionExecutionMessageBody Data { get; set; } = body;
}