using System.Text.Json.Serialization;

namespace SmartGarden.Actuators.Models;

public class MqttActuatorState : MqttActuatorMessage
{
    [JsonPropertyName("messageType")]
    public override string MessageType => MqttActuatorMessage.STATE_MESSAGE_TYPE;

    
    [JsonPropertyName("actuatorKey")]
    public string ActuatorKey { get; set; }
    
    [JsonPropertyName("actuatorType")]
    public string ActuatorType { get; set; }

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