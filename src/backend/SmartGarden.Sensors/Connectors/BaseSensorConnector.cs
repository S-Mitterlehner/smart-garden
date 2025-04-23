using System.Buffers;
using System.Text;
using System.Text.Json;
using MQTTnet;
using MQTTnet.Protocol;
using SmartGarden.Core.Enums;
using SmartGarden.Sensors.Models;

namespace SmartGarden.Sensors.Connectors;

public abstract class BaseSensorConnector : ISensorConnector
{
    private readonly ISensorListener _listener;
    private SensorData _lastData;
    
    protected abstract SensorData InitialData { get; }


    protected BaseSensorConnector(string key, ISensorListener listener, IMqttClient mqttClient)
    {
        Key = key;
        _listener = listener;
        _lastData = InitialData;

        mqttClient.ApplicationMessageReceivedAsync += OnMqttClientOnApplicationMessageReceivedAsync;
        Console.WriteLine($"Topic: {Topic}");
        mqttClient.SubscribeAsync(Topic, MqttQualityOfServiceLevel.AtLeastOnce);
    }

    public string Key { get; }
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
            
            Console.WriteLine($"Topic received {Topic}: {data} {parsed.CurrentValue}");

            _lastData = SensorData.FromMqtt(parsed, Type);
            await _listener.PublishMeasurementAsync(_lastData);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error parsing MQTT message: " + ex.Message);
        }
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