using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.Modules.Sensors;
using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.API.Listener;

public class RabbitMqSensorListener : ISensorListener
{
    private readonly ILogger<RabbitMqSensorListener> logger;
    private readonly IModel channel;
    
    private const string ExchangeName = "sensorExchange";
    private const string QueueName = "sensorQueue";
    private const string RoutingKey = "sensor.data";

    public RabbitMqSensorListener(IConnection rabbitConnection, ILogger<RabbitMqSensorListener> logger)
    {
        this.logger = logger;
        
        channel = rabbitConnection.CreateModel();
        channel.ExchangeDeclare(ExchangeName, ExchangeType.Direct, durable: true);
        channel.QueueDeclare(QueueName, durable: false, exclusive: false, autoDelete: false);
        channel.QueueBind(QueueName, ExchangeName, RoutingKey);
    }
    
    public Task PublishMeasurementAsync(SensorData data)
    {
        logger.LogDebug("RabbitMQ PublishMeasurement: {data}", data);
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
        var json = JsonSerializer.Serialize(dto);
        var body = Encoding.UTF8.GetBytes(json);
        
        var props = channel.CreateBasicProperties();
        props.AppId = "SmartGarden.API";
        props.ContentType = "application/json";
        props.ContentEncoding = "utf-8";
        props.MessageId = Guid.NewGuid().ToString();
        props.CorrelationId = dto.SensorKey;
        props.Timestamp = new AmqpTimestamp(DateTimeOffset.UtcNow.ToUnixTimeSeconds());
        props.DeliveryMode = 1; // Not Persistent
        props.Expiration = "60000"; // 60 seconds
        props.Priority = 5;
        props.Headers = new Dictionary<string, object>
        {
            { "sensorKey", dto.SensorKey },
            { "sensorType", dto.SensorType }
        };

        channel.BasicPublish(
            exchange: ExchangeName,
            routingKey: RoutingKey,
            basicProperties: props,
            body: body
        );
        
        return Task.CompletedTask;
    }
}