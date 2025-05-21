using RabbitMQ.Client;
using SmartGarden.Modules.Enums;

namespace SmartGarden.Messaging.Messages;

public class RegisterModuleMessage(RegisterModuleMessageBody data) : IMessage<RegisterModuleMessageBody>
{
    public static string Exchange => "SmartGarden";
    public static string Queue => "SG-ModuleRegister";
    public static string RoutingKey => "ModuleRegisterChange";
    public static ulong? Expiration => null;
    public static DeliveryModes DeliveryMode => DeliveryModes.Persistent;
    public string? CorrelationId => Data.ModuleKey;
    public RegisterModuleMessageBody Data => data;
}

public class RegisterModuleMessageBody()
{
    public string ModuleKey { get; set; }
    public ModuleType ModuleType { get; set; }
}
