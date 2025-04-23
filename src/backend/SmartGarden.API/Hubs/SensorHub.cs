using Microsoft.AspNetCore.SignalR;
using SmartGarden.Sensors;
using SmartGarden.Sensors.Models;

namespace SmartGarden.API.Hubs;

public class SensorHub(ILogger<SensorHub> logger) : Hub//, ISensorListener
{

    //public async Task PublishMeasurementAsync(SensorData data)
    //{
    //    await Clients.All.SendAsync(MEASUREMENT_MADE, data.SensorKey, data);
    //}
}