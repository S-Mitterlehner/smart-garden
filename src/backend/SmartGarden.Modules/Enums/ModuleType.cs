using System.Linq.Expressions;
using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Enums;

[Flags]
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ModuleType
{
    // Sensors
    Temperature = 1 << 0,
    Humidity = 1 << 1,
    Moisture = 1 << 2,

    // Actuators
    Pump = 1 << 20,
    Hatch = 1 << 21,
}

public static class ModuleTypeExpressions
{
    public static Expression<Func<ModuleType, bool>> IsSensor => x => (int) x < 1 << 20;
    public static Expression<Func<ModuleType, bool>> IsActuator => x => (int)x >= 1 << 20;
}

public static class ModuleTypeExtensions
{
    public static bool IsSensor(this ModuleType type) => ModuleTypeExpressions.IsSensor.Compile().Invoke(type);
    public static bool IsActuator(this ModuleType type) => ModuleTypeExpressions.IsActuator.Compile().Invoke(type);
}