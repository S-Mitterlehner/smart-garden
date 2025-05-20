using SmartGarden.Modules;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Actuators.Models;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Sensors;
using SmartGarden.Modules.Sensors.Models;
using ActionDefinition = SmartGarden.Modules.Models.ActionDefinition;

namespace SmartGarden.API.Listener;

public class LegacyModuleListenerProxy(ISensorListener sensorListener, IActuatorListener actuatorListener) : IModuleListener
{
    public async Task PublishStateChangeAsync(ModuleState data, IEnumerable<ActionDefinition> actions)
    {
        if ((data.ModuleType & ModuleType.Sensor) != 0)
        {
            var sensorData = new SensorData
            {
                Unit = data.Unit
                , CurrentValue = data.CurrentValue ?? -1
                , Min = data.Min ?? -1
                , Max = data.Max ?? -1
                , SensorKey = data.ModuleKey
                , SensorType = data.ModuleType
                , ConnectionState = data.ConnectionState
                , LastUpdate = data.LastUpdate
            };

            await sensorListener.PublishMeasurementAsync(sensorData);
        }
        else
        {
            var actuatorState = new ActuatorState
            {
                Unit = data.Unit,
                CurrentValue = data.CurrentValue ?? -1,
                StateType = data.StateType,
                State = data.State,
                Min = data.Min ?? -1,
                Max = data.Max ?? -1,
                ActuatorKey = data.ModuleKey,
                ActuatorType = data.ModuleType,
                ConnectionState = data.ConnectionState,
                LastUpdate = data.LastUpdate
            };

            var actionList = actions.Select(a => new Modules.Actuators.Models.ActionDefinition
            {
                Increment = a.Increment,
                IsAllowed = a.IsAllowed,
                ActionType = (SmartGarden.Modules.Actuators.Enums.ActionType)(int) a.ActionType,
                CurrentValue = a.CurrentValue,
                Description = a.Description,
                Icon = a.Icon,
                Key = a.ActionKey,
                Max = a.Max,
                Min = a.Min,
                Name = a.Name,
                Unit = a.Unit
            });


            await actuatorListener.PublishStateChangeAsync(actuatorState, actionList);
        }
    }
}
