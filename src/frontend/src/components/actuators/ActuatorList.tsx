import { ActuatorRef } from "../../models/actuator";
import { getTypeIconCircle } from "./utils";

export type ActuatorListProps = {
  Actuators: ActuatorRef[];
  disabledActuators?: ActuatorRef[];
  onSelectActuator?: (Actuator: ActuatorRef) => void;
};

export default function ActuatorList({
  Actuators,
  disabledActuators = [],
  onSelectActuator = () => {},
}: ActuatorListProps) {
  return (
    <div className="flex flex-col gap-4">
      {Actuators.map((actuator) => (
        <button
          key={actuator.id}
          className="flex flex-col gap-2 p-2 phone:p-4 border rounded-lg hover:bg-gray-100 text-left cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
          disabled={disabledActuators.some((s) => s.id === actuator.id)}
          onClick={() => onSelectActuator(actuator)}
        >
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="text-xl font-bold flex flex-row gap-3 items-center">
              <div>{getTypeIconCircle(actuator.type)}</div>
              <span className="line-clamp-1">{actuator.name}</span>
            </span>
            <span className="text-gray-400 text-sm text-right self-center">
              {actuator.type}
            </span>
          </div>

          <span className="text-gray-500 col-span-2">
            {actuator.description}
          </span>

          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="text-red-500 text-xs">
              {disabledActuators.some((s) => s.id === actuator.id)
                ? "already connected"
                : null}
            </span>
            <span className=" text-xs self-center justify-self-end flex flex-row gap-2">
              <span className="text-gray-400">Device:</span>
              <span className="text-gray-500">{actuator.key}</span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
