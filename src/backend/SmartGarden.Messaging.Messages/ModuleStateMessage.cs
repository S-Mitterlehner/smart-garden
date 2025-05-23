using RabbitMQ.Client;

namespace SmartGarden.Messaging.Messages;

public class ModuleStateMessage(ModuleStateMessageBody data) : IMessage<ModuleStateMessageBody>
{
    public static string Exchange => "ModuleState_Exchange";
    public static ulong? Expiration => null;
    public static DeliveryModes DeliveryMode => DeliveryModes.Persistent;
    public static string GetQueueName(string clientId) => $"{clientId}_ModuleState_Queue";
    public string? CorrelationId => Data.ModuleKey;
    public ModuleStateMessageBody Data => data;
}