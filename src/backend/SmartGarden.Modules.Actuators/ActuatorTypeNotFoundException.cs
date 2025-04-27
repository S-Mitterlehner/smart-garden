using SmartGarden.Modules.Enums;

namespace SmartGarden.Modules.Actuators;

public class ActuatorTypeNotFoundException(ActuatorType type): Exception($"Connector for Actuator type '{type}' not found.");