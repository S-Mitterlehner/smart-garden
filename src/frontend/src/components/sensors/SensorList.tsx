import { SensorRef } from "../../models/sensor";
import { getTypeIconCircle } from "./utils";

export type SensorListProps = {
  sensors: SensorRef[];
  disabledSensors?: SensorRef[];
  onSelectSensor?: (sensor: SensorRef) => void;
};

export default function SensorList({
  sensors,
  disabledSensors = [],
  onSelectSensor = () => {},
}: SensorListProps) {
  return (
    <div className="flex flex-col gap-4">
      {sensors.map((sensor) => (
        <button
          key={sensor.id}
          className="flex flex-col gap-2 p-2 phone:p-4 border rounded-lg hover:bg-gray-100 text-left cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
          disabled={disabledSensors.some((s) => s.id === sensor.id)}
          onClick={() => onSelectSensor(sensor)}
        >
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="text-xl font-bold flex flex-row gap-3 items-center">
              <div>{getTypeIconCircle(sensor.type)}</div>
              <span className="line-clamp-1">{sensor.name}</span>
            </span>
            <span className="text-gray-400 text-sm text-right self-center">
              {sensor.type}
            </span>
          </div>

          <span className="text-gray-500 col-span-2">{sensor.description}</span>

          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="text-red-500 text-xs">
              {disabledSensors.some((s) => s.id === sensor.id)
                ? "already connected"
                : null}
            </span>
            <span className=" text-xs self-center justify-self-end flex flex-row gap-2">
              <span className="text-gray-400">Sensor:</span>
              <span className="text-gray-500">{sensor.key}</span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
