using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Service.Models;

public class MqttActionExecution : MqttActuatorMessage
{
    [JsonPropertyName("messageType")]
    public override string MessageType => MqttActuatorMessage.ACTION_MESSAGE_TYPE;

    [JsonPropertyName("actionKey")]
    public string ActionKey { get; set; }

    [JsonPropertyName("actuatorKey")]
    public string ActuatorKey { get; set; }

    [JsonPropertyName("actuatorType")]
    public string ActuatorType { get; set; }

    [JsonPropertyName("actionType")]
    public string Type { get; set; }

    [JsonPropertyName("value")]
    public double? Value { get; set; }
}