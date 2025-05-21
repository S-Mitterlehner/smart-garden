using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Service.Models;

public abstract class MqttMessage
{
    public const string ACTION_MESSAGE_TYPE = "Action";
    public const string STATE_MESSAGE_TYPE = "State";

    [JsonPropertyName("messageType")]
    public abstract string MessageType { get; }
}