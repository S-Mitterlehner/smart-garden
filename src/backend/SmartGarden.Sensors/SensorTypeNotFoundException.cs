using SmartGarden.Core.Enums;

namespace SmartGarden.Sensors;

public class SensorTypeNotFoundException(SensorType type): Exception($"Connector for Sensor type '{type}' not found.");