using System.Data;
using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Dtos;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.API.Hubs;
using SmartGarden.Modules.Sensors;
using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.API.Listener;

public class SignalRSensorListener(IHubContext<SensorHub> context, ILogger<SignalRSensorListener> logger) : ISensorListener
{
    public const string MEASUREMENT_MADE = "Sensor_Measurement";

    public async Task PublishMeasurementAsync(SensorData data)
    {
        logger.LogDebug("SignalR PublishMeasurement: {data}", data);
        var dto = new SensorDataDto
        {
            Unit = data.Unit
            , CurrentValue = data.CurrentValue
            , Min = data.Min
            , Max = data.Max
            , SensorKey = data.SensorKey
            , SensorType = data.SensorType.ToString()
            , ConnectionState = data.ConnectionState.ToString()
            , LastUpdate = data.LastUpdate
        };
        
        await context.Clients.All.SendAsync(MEASUREMENT_MADE, data.SensorKey, data.SensorType.ToString(), dto);
    }
}