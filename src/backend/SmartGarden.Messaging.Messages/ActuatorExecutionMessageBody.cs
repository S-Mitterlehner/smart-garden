namespace SmartGarden.Messaging.Messages;

public enum ActionType
{
    Command, 
    Value
}

public class ActuatorExecutionMessageBody
{
    public string ActuatorKey { get; set; }
    public string ActionKey { get; set; }
    public ActionType Type { get; set; }
    public double? Value { get; set; }
    public int ActuatorType { get; set; }
}
