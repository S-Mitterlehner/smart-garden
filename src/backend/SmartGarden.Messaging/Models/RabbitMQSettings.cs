namespace SmartGarden.Messaging.Models;

public class RabbitMQSettings
{
    public string AppId { get; set; }
    public Dictionary<string, RabbitMQChannelSettings> Channels { get; set; }
}

public class RabbitMQChannelSettings
{
    public string Exchange { get; set; }
    public string Queue { get; set; }
    public string RoutingKey { get; set; }
}