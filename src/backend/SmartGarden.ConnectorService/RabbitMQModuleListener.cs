using Microsoft.Extensions.Logging;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Models;

namespace SmartGarden.ConnectorService;

public class RabbitMQModuleListener(IMessagingProducer producer, ILogger<RabbitMQMessagingProducer> logger) : IModuleListener
{
    public async Task PublishStateChangeAsync(ModuleState data, IEnumerable<ActionDefinition> actions)
    {
        var body = new ModuleStateMessageBody
        {
            ModuleType = data.ModuleType.ToString()
            , ModuleKey = data.ModuleKey
            , StateType = data.StateType.ToString()
            , CurrentValue = data.CurrentValue
            , State = data.State
            , Max = data.Max
            , Min = data.Min
            , Unit = data.Unit
            , ConnectionState = data.ConnectionState.ToString()
            , LastUpdate = data.LastUpdate
        };

        var msg = new ModuleStateMessage(body);

        logger.LogInformation("ModuleStateChange Send: {@msg}", body);

        await producer.SendAsync(msg);
    }
}