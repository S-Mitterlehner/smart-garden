import { ControllerState } from "../../models/controller";
import {
  IconPlugConnectedX,
  IconSettings,
  IconSettingsPause,
  IconWind,
  IconWindOff,
} from "@tabler/icons-react";

export type ControllerStateProps = {
  state: ControllerState;
};

export default function ControllerStateIndicator({
  state,
}: ControllerStateProps) {
  const getStateTemplate = () => {
    switch (state) {
      case ControllerState.NOT_CONNECTED:
        return (
          <span className="text-gray-500">
            <IconPlugConnectedX className="w-24 h-24" />
          </span>
        );
      case ControllerState.OPEN:
        return (
          <span className="text-green-500">
            <IconWind className="w-24 h-24" />
          </span>
        );
      case ControllerState.CLOSED:
        return (
          <span className="text-red-500">
            <IconWindOff className="w-24 h-24" />
          </span>
        );
      case ControllerState.RUNNING:
        return (
          <span className="text-green-500">
            <IconSettings className="w-24 h-24 animate-spin-slow" />
          </span>
        );
      case ControllerState.STOPPED:
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
