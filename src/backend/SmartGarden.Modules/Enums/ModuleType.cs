using System.Linq.Expressions;
using System.Text.Json.Serialization;

namespace SmartGarden.Modules.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ModuleTypeGroup
{
    Sensor,
    Actuator
}

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
    public static Expression<Func<ModuleType, ModuleTypeGroup>> Group => x => (int)x < 1 << 20 ? ModuleTypeGroup.Sensor : ModuleTypeGroup.Actuator;
    public static Expression<Func<ModuleType, bool>> IsSensor => x => (int)x < 1 << 20;
    public static Expression<Func<ModuleType, bool>> IsActuator => x => (int)x >= 1 << 20;
}

public static class ModuleTypeExtensions
{
    public static ModuleTypeGroup GetModuleTypeGroup(this ModuleType type) => ModuleTypeExpressions.Group.Compile().Invoke(type);
    public static bool IsSensor(this ModuleType type) => GetModuleTypeGroup(type) == ModuleTypeGroup.Sensor;
    public static bool IsActuator(this ModuleType type) => GetModuleTypeGroup(type) == ModuleTypeGroup.Actuator;
}