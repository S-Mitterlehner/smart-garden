using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Actuators.Models;

public abstract class MqttActuatorMessage
{
    public const string ACTION_MESSAGE_TYPE = "Action";
    public const string STATE_MESSAGE_TYPE = "State";

    [JsonPropertyName("messageType")]
    public abstract string MessageType { get; }
}