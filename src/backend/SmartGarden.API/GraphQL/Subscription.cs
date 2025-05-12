using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.API.Listener;

namespace SmartGarden.API.GraphQL;

public class Subscription
{
    [Subscribe]
    [Topic(GraphQlSensorListener.MEASUREMENT_MADE)]
    public SensorDataDto OnSensorMeasurement([EventMessage] SensorDataDto dto) => dto;
    
    [Subscribe]
    [Topic(GraphQlActuatorListener.STATE_CHANGED)]
    public ActuatorStateDto OnActuatorStateChanged([EventMessage] ActuatorStateDto data) => data;
}