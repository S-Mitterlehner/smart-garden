using Microsoft.AspNetCore.SignalR;
using SmartGarden.Api.Beds.Dtos.Sensor;
using SmartGarden.Api.Beds.Hubs;
using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Sensors;
using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.Api.Beds.Listener.Legacy;

[Obsolete("Use SignalRModuleListener instead")]
public class SignalRSensorListener(IHubContext<SensorHub> context, ILogger<SignalRSensorListener> logger) : ISensorListener
{
    public const string MEASUREMENT_MADE = "Sensor_Measurement";
    public static string GetGroup(string key, ModuleType type) => $"{MEASUREMENT_MADE}_{key}_{type}";

    public async Task PublishMeasurementAsync(SensorData data)
    {
        logger.LogDebug("SignalR PublishMeasurement: {@data}", data);
        var dto = new SensorDataDto
        {
            Unit = data.Unit
            , CurrentValue = data.CurrentValue
            , Min = data.Min
            , Max = data.Max
            , SensorKey = data.SensorKey
            , SensorType = data.SensorType
            , ConnectionState = data.ConnectionState
            , LastUpdate = data.LastUpdate
        };
        
        await context.Clients.Group(GetGroup(dto.SensorKey, dto.SensorType)).SendAsync(MEASUREMENT_MADE, data.SensorKey, data.SensorType.ToString(), dto);
    }
}