namespace SmartGarden.Modules.Enums;

[Flags]
public enum ModuleType
{
    // Sensors
    Temperature = 1 << 0,
    Humidity = 1 << 1,
    Moisture = 1 << 2,
    
    // Actuators
    Pump = 1 << 20,
    Hatch = 1 << 21,

    // Groups for Checking
    Sensor = Temperature | Humidity | Moisture,
    Actuator = Pump | Hatch,
}