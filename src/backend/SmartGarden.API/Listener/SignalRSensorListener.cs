using System.Data;
using Microsoft.AspNetCore.SignalR;
using SmartGarden.API.Dtos;
using SmartGarden.API.Hubs;
using SmartGarden.Sensors;
using SmartGarden.Sensors.Models;

namespace SmartGarden.API.Listener;

public class SignalRSensorListener(IHubContext<SensorHub> context, ILogger<SignalRSensorListener> logger) : ISensorListener
{
    public const string MEASUREMENT_MADE = "Sensor_Measurement";

    public async Task PublishMeasurementAsync(SensorData data)
    {
        logger.LogDebug("MeasurementMade: {data}", data);
        var dto = new SensorDataDto
        {
            Unit = data.Unit
            , CurrentValue = data.CurrentValue
            , Min = data.Min
            , Max = data.Max
            , SensorKey = data.SensorKey
            , ConnectionState = data.ConnectionState.ToString().ToUpper()
        };

        await context.Clients.All.SendAsync(MEASUREMENT_MADE, data.SensorKey, dto);
    }
}