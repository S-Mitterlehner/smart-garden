using SmartGarden.Core.Enums;

namespace SmartGarden.Sensors;

public interface ISensorManager
{
    ISensorConnector GetConnector(string key, SensorType type);
}