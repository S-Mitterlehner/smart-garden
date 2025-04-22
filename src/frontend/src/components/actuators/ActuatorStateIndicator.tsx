import {
  ActuatorState,
  ActuatorStateStrings,
  StateType,
} from "../../models/actuator";
import {
  IconPlugConnectedX,
  IconSettings,
  IconSettingsPause,
  IconWind,
  IconWindOff,
} from "@tabler/icons-react";
import { ConnectionState } from "../../models/general";
import Gauge from "../Gauge";

export type ActuatorStateProps = {
  state: ActuatorState;
};

export default function ActuatorStateIndicator({ state }: ActuatorStateProps) {
  const getStateTemplate = () => {
    if (state.connectionState === ConnectionState.NotConnected)
      return (
        <span className="text-gray-500 min-h-44">
          <IconPlugConnectedX className="w-24 h-24" />
        </span>
      );

    if (state.type === StateType.Continuous)
      return (
        <span className="min-h-44">
          <Gauge
            value={state.value}
            min={state.min}
            max={state.max}
            showValue={true}
            unit={state.unit}
          />
        </span>
      );

    const getIndicator = () => {
      switch (state.state) {
        case ActuatorStateStrings.Open:
          return <IconWind className="w-24 h-24 text-green-50" />;
        case ActuatorStateStrings.Closed:
          return <IconWindOff className="w-24 h-24 text-red-500" />;
        case ActuatorStateStrings.Running:
          return (
            <IconSettings className="w-24 h-24 animate-spin-slow text-green-500" />
          );
        case ActuatorStateStrings.Stopped:
          return <IconSettingsPause className="w-24 h-24 text-red-500" />;
      }
    };

    return (
      <div className="min-h-44 flex justify-center items-center">
        {getIndicator()}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">{getStateTemplate()}</div>
  );
}
