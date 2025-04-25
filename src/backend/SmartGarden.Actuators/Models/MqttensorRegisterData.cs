using System.Text.Json.Serialization;

namespace SmartGarden.Actuators.Models;

public class MqttActuatorRegisterData
{
    
    [JsonPropertyName("actuatorKey")]
    public string ActuatorKey { get; set; }

    [JsonPropertyName("topics")]
    public Dictionary<string, string> Topics { get; set; } = new();
}