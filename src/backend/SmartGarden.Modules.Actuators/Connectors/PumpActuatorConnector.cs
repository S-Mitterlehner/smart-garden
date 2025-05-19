using MQTTnet;
using SmartGarden.Modules.Actuators.Enums;
using SmartGarden.Modules.Actuators.Models;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Actuators.Connectors;

public static class PumpActuatorConnectorActions
{
    public const string Start = "pump.start";
    public const string Stop = "pump.stop";
    public const string RunFor = "pump.run";
}

public static class PumpActuatorConnectorStates
{
    public const string Running = "Running";
    public const string Stopped = "Stopped";
}

public class PumpActuatorConnector(string key, string topic, IMqttClient mqttClient, IActuatorListener listener) 
    : BaseActuatorConnector(key, topic, mqttClient, listener)
{
    public override ActuatorType Type => ActuatorType.Pump;
    public override string Name => "Water Pump";
    public override string Description => "Water Pump for irrigation";

    protected override ActuatorState InitialState => new ActuatorState
    {
        ConnectionState = ConnectionState.NotConnected,
        ActuatorType = Type,
        StateType = StateType.Discrete,
        ActuatorKey = Key,
        State = PumpActuatorConnectorStates.Stopped
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
                Key = PumpActuatorConnectorActions.Start,
                IsAllowed = state is { ConnectionState: ConnectionState.Connected, State: PumpActuatorConnectorStates.Stopped },
                Icon = ActionIcons.Play
            },
            new ActionDefinition
            {
                Name = "Stop",
                Description = "Stop the water pump",
                ActionType = ActionType.Command,
                Key =  PumpActuatorConnectorActions.Stop,
                IsAllowed = state is { ConnectionState: ConnectionState.Connected, State: PumpActuatorConnectorStates.Running },
                Icon = ActionIcons.Stop
            },
            new ActionDefinition
            {
                Name = "Run for",
                Description = "Run the water pump for a specified time in seconds",
                Key = PumpActuatorConnectorActions.RunFor,
                ActionType = ActionType.Value,
                IsAllowed = state is { ConnectionState: ConnectionState.Connected, State: PumpActuatorConnectorStates.Stopped },
                Icon = ActionIcons.Timer,
                CurrentValue = 1,
                Min = 1,
                Max = 120,
                Increment = 1,
                Unit = "sec"
            }
        ];
    }

    public override async Task<ModuleAutomationConfig> GetAutomationConfigAsync()
    {
        return new ModuleAutomationConfig<ActuatorType>
        {
            ModuleType = Type,
            ConnectorKey = Key,
            TsType = "select",
            Values = [
                new DiscreteValue
                {
                    Label = "Running",
                    Value = PumpActuatorConnectorStates.Running
                },
                new DiscreteValue
                {
                    Label = "Stopped",
                    Value = PumpActuatorConnectorStates.Stopped
                }
            ],
        };
    }
}