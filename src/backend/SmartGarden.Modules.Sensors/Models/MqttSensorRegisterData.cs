using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Sensors.Models;

public class MqttSensorRegisterData
{
    
    [JsonPropertyName("sensorKey")]
    public string SensorKey { get; set; }

    [JsonPropertyName("topics")]
    public Dictionary<string, string> Topics { get; set; } = new();
}