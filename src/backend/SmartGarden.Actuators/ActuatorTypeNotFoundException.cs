using SmartGarden.Core.Enums;

namespace SmartGarden.Actuators;

public class ActuatorTypeNotFoundException(ActuatorType type): Exception($"Connector for Actuator type '{type}' not found.");