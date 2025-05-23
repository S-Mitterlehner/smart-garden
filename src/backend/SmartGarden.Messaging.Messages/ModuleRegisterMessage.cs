using RabbitMQ.Client;

namespace SmartGarden.Messaging.Messages;

public class ModuleRegisterMessage(ModuleRegisterMessageBody data) : IMessage<ModuleRegisterMessageBody>
{
    public static string Exchange => "ModuleRegister_Exchange";
    public static ulong? Expiration => null;
    public static DeliveryModes DeliveryMode => DeliveryModes.Persistent;
    public static string GetQueueName(string clientId) => $"{clientId}_ModuleRegister_Queue";

    public string? CorrelationId => Data.ModuleKey;
    public ModuleRegisterMessageBody Data => data;
}

public class ModuleRegisterMessageBody()
{
    public Guid ModuleId { get; set; }
    public string ModuleKey { get; set; }
    public int ModuleType { get; set; }
}
