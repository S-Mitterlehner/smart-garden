namespace SmartGarden.Messaging.Messages;

public class ActionExecutionMessageBody
{
    public string ModuleKey { get; set; }
    public int ModuleType { get; set; }
    public string ActionKey { get; set; }
    public double? Value { get; set; }
}
