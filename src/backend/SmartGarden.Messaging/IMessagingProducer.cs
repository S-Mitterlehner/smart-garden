using SmartGarden.Messaging.Messages;

namespace SmartGarden.Messaging;

public interface IMessagingProducer
{
    Task SendAsync<T>(T msg) where T : IMessage;
}