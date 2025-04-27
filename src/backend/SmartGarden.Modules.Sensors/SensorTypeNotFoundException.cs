using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Sensors;

public class SensorTypeNotFoundException(SensorType type): Exception($"Connector for Sensor type '{type}' not found.");