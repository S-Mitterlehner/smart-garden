using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Service.Models;

public class MqttState : MqttMessage
{
    [JsonPropertyName("messageType")]
    public override string MessageType => MqttMessage.STATE_MESSAGE_TYPE;

    
    [JsonPropertyName("moduleKey")]
    public string ModuleKey { get; set; }
    
    [JsonPropertyName("moduleType")]
    public string ModuleType { get; set; }

    [JsonPropertyName("stateType")]
    public string StateType { get; set; }


    [JsonPropertyName("state")]
    public string? State { get; set; }

    [JsonPropertyName("currentValue")]
    public double CurrentValue { get; set; }

    [JsonPropertyName("min")]
    public double Min { get; set; }

    [JsonPropertyName("max")]
    public double Max { get; set; }

    [JsonPropertyName("unit")]
    public string Unit { get; set; }

}