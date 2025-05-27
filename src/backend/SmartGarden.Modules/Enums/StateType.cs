using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum StateType // TODO: rename to ValueType
{
    Discrete,
    Continuous
}