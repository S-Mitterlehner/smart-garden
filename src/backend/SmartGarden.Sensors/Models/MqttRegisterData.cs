using System.Text.Json.Serialization;

namespace SmartGarden.Sensors.Models;

public class MqttRegisterData
{
    
    [JsonPropertyName("sensorKey")]
    public string SensorKey { get; set; }
    
    [JsonPropertyName("sensorType")]
    public string SensorType { get; set; }
}