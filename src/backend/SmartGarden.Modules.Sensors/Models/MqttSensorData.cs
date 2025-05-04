using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Sensors.Models;

public class MqttSensorData
{
    [JsonPropertyName("sensorKey")]
    public string SensorKey { get; set; }
    
    [JsonPropertyName("sensorType")]
    public string SensorType { get; set; }
    
    [JsonPropertyName("currentValue")]
    public double CurrentValue { get; set; }
    
    [JsonPropertyName("min")]
    public double Min { get; set; }
    
    [JsonPropertyName("max")]
    public double Max { get; set; }
    
    [JsonPropertyName("unit")]
    public string Unit { get; set; }
}