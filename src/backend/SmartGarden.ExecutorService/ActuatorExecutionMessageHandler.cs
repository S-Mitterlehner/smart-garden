using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;
using SmartGarden.Modules.Enums;

namespace SmartGarden.ExecutorService;

public class ActuatorExecutionMessageHandler(ApplicationContext db, IActuatorManager manager) : IMessageHandler<ActuatorExecutionMessageBody>
{
    public async Task HandleAsync(ActuatorExecutionMessageBody msg)
    {
        var reference = await db.Get<ActuatorRef>()
            .FirstAsync(x => 
                x.ConnectorKey == msg.ActuatorKey 
                && x.Type == (ActuatorType)msg.ActuatorType);
        
        var connector = await manager.GetConnectorAsync(reference);
        await connector.ExecuteAsync(new ActionExecution
        {
            Key = msg.ActuatorKey,
            Type = (SmartGarden.Modules.Actuators.Enums.ActionType)msg.Type,
            Value = msg.Value
        });
    }
}