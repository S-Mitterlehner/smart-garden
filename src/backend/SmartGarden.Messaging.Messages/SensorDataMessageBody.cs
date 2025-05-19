namespace SmartGarden.Messaging.Messages;

public class SensorDataMessageBody : BaseMessageBody
{
    public string SensorKey { get; set; }
    public string SensorType { get; set; }
    public string ConnectionState { get; set; }
    public double CurrentValue { get; set; }
    public double Min { get; set; }
    public double Max { get; set; }
    public string Unit { get; set; }
    public DateTime LastUpdate { get; set; }
}