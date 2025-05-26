using SmartGarden.Modules.Sensors;
using SmartGarden.Modules.Sensors.Models;

namespace SmartGarden.API.Listener.Legacy;

[Obsolete("Use GraphQlModuleListener instead")]
public class SensorListenerComposite(params ISensorListener[] sensorListeners) : ISensorListener
{
    public async Task PublishMeasurementAsync(SensorData data)
    {
        foreach (ISensorListener l in sensorListeners)
        {
            await l.PublishMeasurementAsync(data);
        }
    }
}