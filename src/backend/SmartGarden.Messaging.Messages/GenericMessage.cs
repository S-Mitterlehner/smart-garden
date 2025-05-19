namespace SmartGarden.Messaging.Messages;

public class GenericMessage<T> : IMessage
{
    public string Exchange { get; set; }
    public string Queue { get; set; }
    public string RoutingKey { get; set; }
    public object Body { get; set; }

    public GenericMessage(T data, string exchange = "SmartGarden", string queue = "SG-Generic", string routingKey = "GenericRoutingKey")
    {
        Exchange = exchange;
        Queue = queue;
        RoutingKey = routingKey;
        Body = data;
    }
}