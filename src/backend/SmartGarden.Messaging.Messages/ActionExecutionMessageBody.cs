namespace SmartGarden.Messaging.Messages;

public class ActionExecutionMessageBody
{
    public string ActuatorKey { get; set; }
    public string ActionKey { get; set; }
    public int Type { get; set; }
    public double? Value { get; set; }
    public int ActuatorType { get; set; }
}
