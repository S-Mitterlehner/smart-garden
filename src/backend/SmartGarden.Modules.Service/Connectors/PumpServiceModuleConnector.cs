using MQTTnet;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Service.Connectors;

public static class PumpModuleConnectorActions
{
    public const string Start = "pump.start";
    public const string Stop = "pump.stop";
    public const string RunFor = "pump.run";
}

public static class PumpModuleConnectorStates
{
    public const string Running = "Running";
    public const string Stopped = "Stopped";
}

public class PumpServiceModuleConnector(string key, string topic, IMqttClient mqttClient, IModuleListener listener) : BaseActuatorServiceModuleConnector(key, topic, mqttClient, listener)
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
                ActionKey = PumpModuleConnectorActions.Start,
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
            },
            new ActionDefinition
            {
                Name = "Run for",
                Description = "Run the water pump for a specified time in seconds",
                ActionKey = PumpModuleConnectorActions.RunFor,
                ActionType = ActionType.Value,
                IsAllowed = state is { ConnectionState: ConnectionState.Connected, State: PumpModuleConnectorStates.Stopped },
                Icon = ActionIcons.Timer,
                CurrentValue = 1,
                Min = 1,
                Max = 120,
                Increment = 1,
                Unit = "sec"
            }
        ];
    }
}