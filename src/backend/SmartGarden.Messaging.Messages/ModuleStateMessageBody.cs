namespace SmartGarden.Messaging.Messages;

public class ModuleStateMessageBody
{
    public string ModuleKey { get; set; }
    public string ModuleType { get; set; }
    public string ConnectionState { get; set; }
    public string StateType { get; set; }
    public string? State { get; set; }
    public double? CurrentValue { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public DateTime LastUpdate { get; set; }
}