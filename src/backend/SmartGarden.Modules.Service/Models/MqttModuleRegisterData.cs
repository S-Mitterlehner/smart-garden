using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Service.Models;

public class MqttModuleRegisterData
{
    
    [JsonPropertyName("moduleKey")]
    public string ModuleKey { get; set; }

    [JsonPropertyName("topics")]
    public Dictionary<string, string> Topics { get; set; } = new();
}