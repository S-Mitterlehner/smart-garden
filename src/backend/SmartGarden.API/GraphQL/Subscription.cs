using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Dtos.Sensor;

namespace SmartGarden.API.GraphQL;

public class Subscription
{
    [Subscribe]
    public SensorDataDto OnSensorMeasurement([EventMessage] SensorDataDto dto) => dto;
    //public SensorDataDto OnSensorMeasurement(string sensorKey, [EventMessage] SensorDataDto dto) => dto;
    
    [Subscribe]
    //[Topic]
    public ActuatorStateDto OnActuatorStateChanged([EventMessage] ActuatorStateDto data) => data;

    // Optional: Only for a specific actuator
    // [Subscribe]
    // [Topic]
    // public async ValueTask<ISourceStream<ActuatorStateDto>> OnActuatorStateChangedByKey(
    //     string actuatorKey,
    //     [Service] ITopicEventReceiver receiver)
    // {
    //     return await receiver.SubscribeAsync<ActuatorStateDto>($"{ActuatorEventService.ACTUATOR_STATE_CHANGED}_{actuatorKey}");
    // }
}