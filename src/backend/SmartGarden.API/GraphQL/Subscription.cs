using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Dtos.Module;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.API.Listener;
using SmartGarden.API.Listener.Legacy;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.GraphQL;

public class Subscription
{
    [Obsolete("use module instead")]
    public ValueTask<ISourceStream<SensorDataDto>> SubscribeToSensorData(string key, ModuleType type, ITopicEventReceiver receiver) 
        => receiver.SubscribeAsync<SensorDataDto>(GraphQlSensorListener.GetTopic(key, type));

    [Subscribe(With = nameof(SubscribeToSensorData))]
    [Obsolete("use module instead")]
    public SensorDataDto OnSensorMeasurement([EventMessage] SensorDataDto dto) => dto;
    
    [Obsolete("use module instead")]
    public ValueTask<ISourceStream<ActuatorStateDto>> SubscribeToActuatorState(string key, ModuleType type, ITopicEventReceiver receiver) 
        => receiver.SubscribeAsync<ActuatorStateDto>(GraphQlActuatorListener.GetTopic(key, type));

    [Subscribe(With = nameof(SubscribeToActuatorState))]
    [Obsolete("use module instead")]
    public ActuatorStateDto OnActuatorStateChanged([EventMessage] ActuatorStateDto data) => data;


    public ValueTask<ISourceStream<ModuleStateDto>> SubscribeToModuleState(string key, ModuleType type, ITopicEventReceiver receiver) 
        => receiver.SubscribeAsync<ModuleStateDto>(GraphQlModuleListener.GetTopic(key, type));

    [Subscribe(With = nameof(SubscribeToModuleState))]
    public ModuleStateDto OnModuleStateChanged([EventMessage] ModuleStateDto data) => data;
}