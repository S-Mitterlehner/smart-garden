using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Service.Models;

public class MqttActionExecution : MqttMessage
{
    [JsonPropertyName("messageType")]
    public override string MessageType => MqttMessage.ACTION_MESSAGE_TYPE;

    [JsonPropertyName("actionKey")]
    public string ActionKey { get; set; }

    [JsonPropertyName("moduleKey")]
    public string ModuleKey { get; set; }

    [JsonPropertyName("moduleType")]
    public string ModuleType { get; set; }

    [JsonPropertyName("actionType")]
    public string ActionType { get; set; }

    [JsonPropertyName("value")]
    public double? Value { get; set; }
}