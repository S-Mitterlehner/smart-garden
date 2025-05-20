using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Api;

public class ModuleStateMessageHandler(IApiModuleManager manager, IModuleListener listener) : IMessageHandler<ModuleStateMessageBody>
{
    public async Task HandleAsync(ModuleStateMessageBody msgBody)
    {
        var connector = await manager.GetConnectorAsync(new ModuleRefRecord(msgBody.ModuleKey, Enum.Parse<ModuleType>(msgBody.ModuleType)));
        if (connector is null)
            throw new Exception($"No connector found for {msgBody.ModuleKey} of type {msgBody.ModuleType}");

        var state = new ModuleState
        {
            ModuleKey = msgBody.ModuleKey
            , ModuleType = Enum.Parse<ModuleType>(msgBody.ModuleType)
            , ConnectionState = ConnectionState.Connected
            , StateType = Enum.Parse<StateType>(msgBody.StateType)
            , CurrentValue = msgBody.CurrentValue
            , Max = msgBody.Max
            , Min = msgBody.Min
            , State = msgBody.State
            , Unit = msgBody.Unit
            , LastUpdate = msgBody.LastUpdate
        };

        await connector.UpdateStateAsync(state);
        await listener.PublishStateChangeAsync(state, await connector.GetActionsAsync());
    }
}