using HotChocolate.Subscriptions;
using SmartGarden.Api.Beds.Dtos.Sensor;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Sensors;
using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.Api.Beds.Listener.Legacy;

[Obsolete("Use GraphQlModuleListener instead")]
public class GraphQlSensorListener(ITopicEventSender eventSender, ILogger<GraphQlSensorListener> logger) : ISensorListener
{
    public static string GetTopic(string key, ModuleType type) => $"Sensor_Measurement_{key}_{type}";

    public async Task PublishMeasurementAsync(SensorData data)
    {
        logger.LogDebug("GraphQL PublishMeasurement: {@data}", data);
        var dto = new SensorDataDto
        {
            Unit = data.Unit,
            CurrentValue = data.CurrentValue,
            Min = data.Min,
            Max = data.Max,
            SensorKey = data.SensorKey,
            SensorType = data.SensorType,
            ConnectionState = data.ConnectionState,
            LastUpdate = data.LastUpdate
        };
        
        await eventSender.SendAsync(GetTopic(dto.SensorKey, dto.SensorType), dto);
    }
}