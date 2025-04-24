using System.Text.Json.Serialization;

namespace SmartGarden.Sensors.Models;

public class MqttRegisterData
{
    
    [JsonPropertyName("sensorKey")]
    public string SensorKey { get; set; }

    [JsonPropertyName("topics")]
    public Dictionary<string, string> Topics { get; set; } = new();
}