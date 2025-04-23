using System.Buffers;
using System.Text;
using System.Text.Json;
using MQTTnet;
using MQTTnet.Protocol;
using SmartGarden.Core.Enums;
using SmartGarden.Mqtt;
using SmartGarden.Sensors.Models;


namespace SmartGarden.Sensors.Connectors;

public abstract class BaseSensorConnector(string key, ISensorListener listener, IMqttClient mqttClient)
    : ISensorConnector
{
    private SensorData _lastData = null!;

    public string Key { get; } = key;
    public abstract SensorType Type { get; }
    public abstract string Topic { get; }
    public abstract string Name { get; }
    public abstract string Description { get; }

    protected abstract SensorData InitialData { get; }

    protected async Task OnMqttClientOnApplicationMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs e)
    {
        try
        {
            var data = e.Parse<MqttSensorData>();

            if (e.ApplicationMessage.Topic != Topic) return; // Ignore messages not for this topic

            _lastData = SensorData.FromMqtt(data, Type);
            await listener.PublishMeasurementAsync(_lastData);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error parsing MQTT message: " + ex.Message);
        }
    }
    
    public async Task InitializeAsync()
    {
        _lastData = InitialData;

        mqttClient.ApplicationMessageReceivedAsync += OnMqttClientOnApplicationMessageReceivedAsync;
        await mqttClient.SubscribeAsync(Topic);
    }

    public Task<SensorData> GetDataAsync() => Task.FromResult(_lastData);
}