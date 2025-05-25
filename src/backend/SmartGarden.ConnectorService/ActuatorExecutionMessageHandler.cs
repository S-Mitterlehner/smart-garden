using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartGarden.ConnectorService.EntityFramework;
using SmartGarden.ConnectorService.EntityFramework.Models;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.ConnectorService;

public class ActuatorExecutionMessageHandler(
    ConnectionServiceDbContext db, 
    IServiceModuleManager manager, 
    ILogger<ActuatorExecutionMessageHandler> logger) 
    : IMessageHandler<ActionExecutionMessageBody>
{
    public async Task HandleAsync(ActionExecutionMessageBody msg)
    {
        try
        {
            var reference = await db.Get<ModuleRef>()
                .FirstAsync(x =>
                    x.ModuleKey == msg.ModuleKey
                    && x.Type == (ModuleType)msg.ModuleType);

            var connector = await manager.GetConnectorAsync(reference);
            await connector.ExecuteAsync(new ActionExecution
            {
                ActionKey = msg.ActionKey,
                Value = msg.Value
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while executing actuator state");
        }
    }
}