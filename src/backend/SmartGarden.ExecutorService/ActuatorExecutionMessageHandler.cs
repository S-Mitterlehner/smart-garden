using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SmartGarden.ConnectorService.EntityFramework;
using SmartGarden.ConnectorService.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using ActionType = SmartGarden.Modules.Enums.ActionType;

namespace SmartGarden.ExecutorService;

public class ActuatorExecutionMessageHandler(
    ConnectionServiceDbContext db, 
    IServiceModuleManager manager, 
    ILogger<ActuatorExecutionMessageHandler> logger) 
    : IMessageHandler<ActuatorExecutionMessageBody>
{
    public async Task HandleAsync(ActuatorExecutionMessageBody msg)
    {
        try
        {
            var reference = await db.Get<ModuleRef>()
                .FirstAsync(x =>
                    x.ModuleKey == msg.ActuatorKey
                    && x.Type == (ModuleType)msg.ActuatorType);

            var connector = await manager.GetConnectorAsync(reference);
            await connector.ExecuteAsync(new ActionExecution
            {
                ActionKey = msg.ActionKey,
                Type = (ActionType)msg.Type,
                Value = msg.Value
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while executing actuator state");
        }
    }
}