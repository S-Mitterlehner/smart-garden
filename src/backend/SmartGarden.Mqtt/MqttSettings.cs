namespace SmartGarden.Mqtt;

public class MqttSettings
{
    public string ClientId { get; set; }
    public string Host { get; set; }
    public int? Port { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
}