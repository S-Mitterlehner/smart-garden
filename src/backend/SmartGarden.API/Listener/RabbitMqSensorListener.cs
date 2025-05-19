using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules.Sensors;
using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.API.Listener;

public class RabbitMqSensorListener(IMessagingProducer producer, ILogger<RabbitMqSensorListener> logger) : ISensorListener
{
    public async Task PublishMeasurementAsync(SensorData data)
    {
        logger.LogDebug("RabbitMQ PublishMeasurement: {data}", data);
        var body = new SensorDataMessageBody
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

        var message = new SensorDataMessage(body);
        await producer.SendAsync(message);
    }
}