namespace SmartGarden.Messaging.Messages;

public class SensorDataMessage(SensorDataMessageBody data) : IMessage<SensorDataMessageBody>
{
    public static string Exchange => "SmartGarden";
    public static string Queue => "SG-SensorData";
    public static string RoutingKey => "SensorRoutingKey";
    public static ulong Expiration => 2_000;
    public string? CorrelationId => Data.SensorKey;
    public SensorDataMessageBody Data => data;
}