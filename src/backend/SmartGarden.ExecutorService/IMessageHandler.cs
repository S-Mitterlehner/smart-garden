using SmartGarden.Messaging.Messages;

namespace SmartGarden.ExecutorService;

public interface IMessageHandler<in T>
{
    Task HandleAsync(T msgBody);
}