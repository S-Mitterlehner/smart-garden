import { SensorRefDto } from "../../__generated__/graphql";
import { getTypeIconCircle } from "./utils";

export type SensorListProps = {
  sensors: SensorRefDto[];
  disabledSensors?: SensorRefDto[];
  onSelectSensor?: (sensor: SensorRefDto) => void;
};

export default function SensorList({ sensors, disabledSensors = [], onSelectSensor = () => {} }: SensorListProps) {
  return (
    <div className="flex flex-col gap-4">
      {sensors.map((sensor) => (
        <button
          key={sensor.id}
          className="flex cursor-pointer flex-col gap-2 rounded-lg border p-2 text-left hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-200 phone:p-4"
          disabled={disabledSensors.some((s) => s.id === sensor.id)}
          onClick={() => onSelectSensor(sensor)}
        >
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="flex flex-row items-center gap-3 text-xl font-bold">
              <div>{getTypeIconCircle(sensor.type)}</div>
              <span className="line-clamp-1">{sensor.name}</span>
            </span>
            <span className="self-center text-right text-sm text-gray-400">{sensor.type}</span>
          </div>

          <span className="col-span-2 text-gray-500">{sensor.description}</span>

          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="text-xs text-red-500">
              {disabledSensors.some((s) => s.id === sensor.id) ? "already connected" : null}
            </span>
            <span className="flex flex-row gap-2 self-center justify-self-end text-xs">
              <span className="text-gray-400">Device:</span>
              <span className="text-gray-500">{sensor.key}</span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
