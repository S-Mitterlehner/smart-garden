using System.Buffers;
using System.Text;
using System.Text.Json;
using MQTTnet;

namespace SmartGarden.Mqtt;

public static class MqttExtensions
{
    public static T? Parse<T>(this MqttApplicationMessageReceivedEventArgs e)
    {
        var data = ReadOnlySequenceToString(e.ApplicationMessage.Payload);
        var parsed = JsonSerializer.Deserialize<T>(data);

        return parsed;
    }

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