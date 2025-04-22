import { ActuatorState } from "../../models/actuator";
import {
  IconPlugConnectedX,
  IconSettings,
  IconSettingsPause,
  IconWind,
  IconWindOff,
} from "@tabler/icons-react";

export type ActuatorStateProps = {
  state: ActuatorState;
};

export default function ActuatorStateIndicator({ state }: ActuatorStateProps) {
  const getStateTemplate = () => {
    switch (state) {
      case ActuatorState.NotConnected:
        return (
          <span className="text-gray-500">
            <IconPlugConnectedX className="w-24 h-24" />
          </span>
        );
      case ActuatorState.Open:
        return (
          <span className="text-green-500">
            <IconWind className="w-24 h-24" />
          </span>
        );
      case ActuatorState.Closed:
        return (
          <span className="text-red-500">
            <IconWindOff className="w-24 h-24" />
          </span>
        );
      case ActuatorState.Running:
        return (
          <span className="text-green-500">
            <IconSettings className="w-24 h-24 animate-spin-slow" />
          </span>
        );
      case ActuatorState.Stopped:
        return (
          <span className="text-red-500">
            <IconSettingsPause className="w-24 h-24" />
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">{getStateTemplate()}</div>
  );
}
