using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.API.Listener;

namespace SmartGarden.API.GraphQL;

public class Subscription
{
    public ValueTask<ISourceStream<SensorDataDto>> SubscribeToSensorData(string key, string type, ITopicEventReceiver receiver) 
        => receiver.SubscribeAsync<SensorDataDto>(GraphQlSensorListener.GetTopic(key, type));

    [Subscribe(With = nameof(SubscribeToSensorData))]
    public SensorDataDto OnSensorMeasurement([EventMessage] SensorDataDto dto) => dto;
    
    public ValueTask<ISourceStream<ActuatorStateDto>> SubscribeToActuatorState(string key, string type, ITopicEventReceiver receiver) 
        => receiver.SubscribeAsync<ActuatorStateDto>(GraphQlActuatorListener.GetTopic(key, type));

    [Subscribe(With = nameof(SubscribeToActuatorState))]
    public ActuatorStateDto OnActuatorStateChanged([EventMessage] ActuatorStateDto data) => data;
}