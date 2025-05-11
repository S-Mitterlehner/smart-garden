using HotChocolate.Subscriptions;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.Modules.Sensors;
using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.API.Listener;

public class GraphQlSensorListener(ITopicEventSender eventSender, ILogger<GraphQlSensorListener> logger) : ISensorListener
{
    public const string MEASUREMENT_MADE = "Sensor_Measurement";
    
    public async Task PublishMeasurementAsync(SensorData data)
    {
        logger.LogDebug("GraphQL PublishMeasurement: {data}", data);
        var dto = new SensorDataDto
        {
            Unit = data.Unit,
            CurrentValue = data.CurrentValue,
            Min = data.Min,
            Max = data.Max,
            SensorKey = data.SensorKey,
            SensorType = data.SensorType.ToString(),
            ConnectionState = data.ConnectionState.ToString(),
            LastUpdate = data.LastUpdate
        };
        
        await eventSender.SendAsync(MEASUREMENT_MADE, dto);
    }
}
