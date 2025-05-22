using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.API.Listener;
using SmartGarden.Modules.Enums;

namespace SmartGarden.API.GraphQL;

public class Subscription
{
    public ValueTask<ISourceStream<SensorDataDto>> SubscribeToSensorData(string key, ModuleType type, ITopicEventReceiver receiver) 
        => receiver.SubscribeAsync<SensorDataDto>(GraphQlSensorListener.GetTopic(key, type));

    [Subscribe(With = nameof(SubscribeToSensorData))]
    public SensorDataDto OnSensorMeasurement([EventMessage] SensorDataDto dto) => dto;
    
    public ValueTask<ISourceStream<ActuatorStateDto>> SubscribeToActuatorState(string key, ModuleType type, ITopicEventReceiver receiver) 
        => receiver.SubscribeAsync<ActuatorStateDto>(GraphQlActuatorListener.GetTopic(key, type));

    [Subscribe(With = nameof(SubscribeToActuatorState))]
    public ActuatorStateDto OnActuatorStateChanged([EventMessage] ActuatorStateDto data) => data;
}