import PlantSelector from "../components/PlantSelector";
// import Card from "../components/Card";
import { useCurrentBed } from "../hooks/useCurrentBed";
import SensorCard from "../components/sensors/SensorCard";
import { PlantSensorConfig } from "../models/plant";
import { SensorType } from "../models/sensor";
import ActuatorCard from "../components/actuators/ActuatorCard";
import { IconBinoculars, IconEngine } from "@tabler/icons-react";
import { useParams } from "react-router";

export default function BedPage() {
  const bedId = useParams().bedId as string;
  const {
    isFetched,
    currentPlant: { value: plant, set: setPlant },
    sensors,
    actuators,
  } = useCurrentBed(bedId);

  const getSensorConfig = (sensorType: SensorType) => {
    const defaultConfig: PlantSensorConfig = {
      sensorType: sensorType,
      rangeFrom: -1,
      rangeTo: -1,
    };

    // if (!plant) return defaultConfig;
    const sensorConfig = plant?.sensorConfigs?.find(
      (config) => config.sensorType === sensorType
    );

    if (!sensorConfig) return defaultConfig;
    return sensorConfig;
  };

  if (!isFetched) {
    return <div>Loading...</div>;
    //TODO: make a loading spinner or skeleton
  }

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
        <h2 className="flex flex-row gap-3 items-center">
          <IconBinoculars className="w-8 h-8 text-emerald-400" /> Sensors
        </h2>
        <div className="flex flex-row gap-4 flex-wrap">
          {sensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              plantConfig={getSensorConfig(sensor.type)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="flex flex-row gap-3 items-center">
          <IconEngine className="w-8 h-8 text-emerald-400" /> Actuators
        </h2>
        <div className="flex flex-row gap-4">
          {actuators.map((actuator) => (
            <ActuatorCard key={actuator.id} actuator={actuator} />
          ))}
        </div>
      </div>
    </div>
  );
}
