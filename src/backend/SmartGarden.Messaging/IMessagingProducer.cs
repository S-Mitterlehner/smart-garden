using SmartGarden.Messaging.Messages;

namespace SmartGarden.Messaging;

public interface IMessagingProducer
{
    Task SendAsync(IMessage msg);
}