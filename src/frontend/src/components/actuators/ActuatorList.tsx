import { ActuatorRefDto } from "../../__generated__/graphql";
import { getTypeIconCircle } from "./utils";

export type ActuatorListProps = {
  Actuators: ActuatorRefDto[];
  disabledActuators?: ActuatorRefDto[];
  onSelectActuator?: (Actuator: ActuatorRefDto) => void;
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
          className="flex cursor-pointer flex-col gap-2 rounded-lg border p-2 text-left hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-200 phone:p-4"
          disabled={disabledActuators.some((s) => s.id === actuator.id)}
          onClick={() => onSelectActuator(actuator)}
        >
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="flex flex-row items-center gap-3 text-xl font-bold">
              <div>{getTypeIconCircle(actuator.type)}</div>
              <span className="line-clamp-1">{actuator.name}</span>
            </span>
            <span className="self-center text-right text-sm text-gray-400">{actuator.type}</span>
          </div>

          <span className="col-span-2 text-gray-500">{actuator.description}</span>

          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="text-xs text-red-500">
              {disabledActuators.some((s) => s.id === actuator.id) ? "already connected" : null}
            </span>
            <span className="flex flex-row gap-2 self-center justify-self-end text-xs">
              <span className="text-gray-400">Device:</span>
              <span className="text-gray-500">{actuator.key}</span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
