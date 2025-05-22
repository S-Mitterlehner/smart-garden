using SmartGarden.Messaging.Messages;

namespace SmartGarden.Messaging;

public interface IMessageHandler<in TBody>
{
    Task HandleAsync(TBody msgBody);
}