using RabbitMQ.Client;

namespace SmartGarden.Messaging.Messages;

public class ModuleStateMessage(ModuleStateMessageBody data) : IMessage<ModuleStateMessageBody>
{
    public static string Exchange => "SmartGarden";
    public static string Queue => "SG-ModuleState";
    public static string RoutingKey => "ModuleStateChange";
    public static ulong? Expiration => null;
    public static DeliveryModes DeliveryMode => DeliveryModes.Persistent;
    public string? CorrelationId => Data.ModuleKey;
    public ModuleStateMessageBody Data => data;
}