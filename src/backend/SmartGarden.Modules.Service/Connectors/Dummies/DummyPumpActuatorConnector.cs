using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Service.Connectors.Dummies;

public class DummyPumpModuleConnector(string key, string topic, IModuleListener listener) : DummyBaseModuleConnector(key, topic, listener)
{
    public override ModuleType Type => ModuleType.Pump;
    protected override ModuleState GetInitialState() => new ModuleState
    {
        ConnectionState = ConnectionState.NotConnected, 
        ModuleType = Type, 
        StateType = StateType.Discrete, 
        ModuleKey = Key, 
        State = PumpModuleConnectorStates.Stopped
    };

    public override async Task<IEnumerable<ActionDefinition>> GetActionsAsync()
    {
        var state = await GetStateAsync();

        return [
            new ActionDefinition
            {
                Name = "Start",
                Description = "Start the water pump",
                ActionType = ActionType.Command,
                ActionKey  = PumpModuleConnectorActions.Start,
                IsAllowed = state is { ConnectionState: ConnectionState.Connected, State: PumpModuleConnectorStates.Stopped },
                Icon = ActionIcons.Play
            },
            new ActionDefinition
            {
                Name = "Stop",
                Description = "Stop the water pump",
                ActionType = ActionType.Command,
                ActionKey =  PumpModuleConnectorActions.Stop,
                IsAllowed = state is { ConnectionState: ConnectionState.Connected, State: PumpModuleConnectorStates.Running },
                Icon = ActionIcons.Stop
            }
        ];
    }

    protected override ModuleState GetStateAfterExecution(ActionExecution execution) => execution.ActionKey switch
        {
            PumpModuleConnectorActions.Start => new ModuleState
            {
                ConnectionState = ConnectionState.Connected
                , ModuleType = Type
                , StateType = StateType.Discrete
                , ModuleKey = Key
                , State = PumpModuleConnectorStates.Running
            }
            , PumpModuleConnectorActions.Stop => new ModuleState
            {
                ConnectionState = ConnectionState.Connected
                , ModuleType = Type
                , StateType = StateType.Discrete
                , ModuleKey = Key
                , State = PumpModuleConnectorStates.Stopped
            }
            , _ => throw new ArgumentOutOfRangeException(nameof(execution), "Action not found for this Module")
        };
}