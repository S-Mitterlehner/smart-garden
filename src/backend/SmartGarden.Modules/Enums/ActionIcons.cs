using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ActionIcons
{
    Play,
    Stop,
    Timer
}