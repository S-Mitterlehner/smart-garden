using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Service.Connectors.Dummies;

public class DummyHatchModuleConnector(string key, string topic, IModuleListener listener) : DummyBaseModuleConnector(key, topic, listener)
{
    public override ModuleType Type => ModuleType.Hatch;

    protected override ModuleState GetInitialState() =>
        new ModuleState
        {
            ConnectionState = ConnectionState.NotConnected
            , ModuleType = Type
            , StateType = StateType.Continuous
            , ModuleKey = Key
            , Unit = "%"
            , CurrentValue = 0
            , Min = 0
            , Max = 100
        };

    public override async Task<IEnumerable<ActionDefinition>> GetActionsAsync()
    {
        var state = await GetStateAsync();
        return
        [
            new ActionDefinition
            {
                Name = "Open"
                , ActionType = ActionType.Value
                , Description = "Open the hatch to a certain value"
                , ActionKey = HatchModuleConnectorActions.Open
                , IsAllowed = true
                , CurrentValue = state.CurrentValue
                , Min = state.Min
                , Max = state.Max
                , Unit = "°"
            }
        ];
    }

    protected override ModuleState GetStateAfterExecution(ActionExecution execution) => new()
    {
        StateType = StateType.Continuous
        , Unit = "%"
        , ModuleKey = Key
        , ConnectionState = ConnectionState.Connected
        , CurrentValue = execution.Value
        , Max = 100
        , Min = 0
        , LastUpdate = DateTime.UtcNow
        , ModuleType = Type
    };
}