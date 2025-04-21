import PlantSelector from "../components/PlantSelector";
// import Card from "../components/Card";
import { useCurrentBeet } from "../hooks/useCurrentBeet";
import SensorCard from "../components/sensors/SensorCard";
import { PlantSensorConfig } from "../models/plant";
import { SensorType } from "../models/sensor";
import ControllerCard from "../components/controllers/ControllerCard";

export default function Beet() {
  const {
    isFetched,
    currentPlant: { value: plant, set: setPlant },
    sensors,
    controllers,
  } = useCurrentBeet("123");

  if (!isFetched) {
    return <div>Loading...</div>;
    //TODO: make a loading spinner or skeleton
  }

  const getSensorConfig = (sensorType: SensorType) => {
    const defaultConfig: PlantSensorConfig = {
      sensorType: sensorType,
      rangeFrom: 15,
      rangeTo: 60, //TODO: get from sensor
    };

    // if (!plant) return defaultConfig;
    const sensorConfig = plant!.sensorConfig.find(
      (config) => config.sensorType === sensorType
    );
    if (!sensorConfig) return defaultConfig;
    return sensorConfig;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <PlantSelector selectedPlant={plant} setSelectedPlant={setPlant} />
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold">{plant?.name}</span>
          <span className="text-gray-500">{plant?.description}</span>
        </div>
      </div>

      <div>
        <h2>Sensors</h2>
        <div className="flex flex-row gap-4">
          {sensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              plantConfig={getSensorConfig(sensor.sensorType)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2>Controllers</h2>
        <div className="flex flex-row gap-4">
          {controllers.map((controller) => (
            <ControllerCard key={controller.id} controller={controller} />
          ))}
        </div>
      </div>
    </div>
  );
}
