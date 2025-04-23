using System.Buffers;
using System.Text;
using System.Text.Json;
using MQTTnet;
using MQTTnet.Protocol;
using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Models;

namespace SmartGarden.Sensors.Connectors;

public abstract class BaseSensorConnector(string key, ISensorListener listener, IMqttClient mqttClient)
    : ISensorConnector
{
    private SensorData _lastData = null!;
    
    protected abstract SensorData InitialData { get; }


    public string Key { get; } = key;
    public abstract SensorType Type { get; }
    public abstract string Topic { get; }
    public abstract string Name { get; }
    public abstract string Description { get; }

    protected async Task OnMqttClientOnApplicationMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs e)
    {
        try
        {
            var data = ReadOnlySequenceToString(e.ApplicationMessage.Payload);
            var parsed = JsonSerializer.Deserialize<MqttSensorData>(data);

            if (e.ApplicationMessage.Topic != Topic) return; // Ignore messages not for this topic

            Console.WriteLine($"Topic received {Topic}: {Type} - {data} {parsed.CurrentValue}");

            _lastData = SensorData.FromMqtt(parsed, Type);
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

    public static string ReadOnlySequenceToString(ReadOnlySequence<byte> sequence)
    {
        if (sequence.IsSingleSegment)
        {
            return Encoding.UTF8.GetString(sequence.First.Span);
        }

        // If the sequence has multiple segments
        byte[] buffer = sequence.ToArray();
        return Encoding.UTF8.GetString(buffer);
    }
}