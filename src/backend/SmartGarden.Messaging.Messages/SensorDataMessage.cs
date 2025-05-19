namespace SmartGarden.Messaging.Messages;

public class SensorDataMessage(SensorDataMessageBody data) : IMessage
{
    public string Exchange => "SmartGarden";
    public string Queue => "SG-SensorData";
    public string RoutingKey => "SensorRoutingKey";
    public string? CorrelationId => Data.SensorKey;

    public object Body => Data;
    public SensorDataMessageBody Data { get; set; }
}