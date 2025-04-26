import {
  ActuatorState,
  ActuatorStateStrings,
  StateType,
} from "../../models/actuator";
import {
  IconHourglassEmpty,
  IconPlugConnectedX,
  IconSettings,
  IconSettingsPause,
  IconWind,
  IconWindOff,
} from "@tabler/icons-react";
import { ConnectionState } from "../../models/general";
import Gauge from "../Gauge";
import { Tooltip } from "@mantine/core";

export type ActuatorStateProps = {
  state: ActuatorState | null;
  connectionState?: ConnectionState;
};

export default function ActuatorStateIndicator({
  state,
  connectionState,
}: ActuatorStateProps) {
  const getStateTemplate = () => {
    if (connectionState === ConnectionState.NotConnected)
      return (
        <span className="text-gray-500 min-h-44 flex justify-center items-center">
          <Tooltip label="Not connected" withArrow position="top">
            <IconPlugConnectedX className="w-24 h-24" />
          </Tooltip>
        </span>
      );

    if (state === null)
      return (
        <span className="text-gray-500 min-h-44 flex justify-center items-center">
          <Tooltip label="Waiting for Status" withArrow position="top">
            <IconHourglassEmpty className="w-24 h-24" />
          </Tooltip>
        </span>
      );

    if (state.stateType === StateType.Continuous)
      return (
        <span className="min-h-44">
          <Gauge
            value={state.value!}
            min={state.min!}
            max={state.max!}
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
      <Tooltip label={state.state} withArrow position="top">
        <div className="min-h-44 flex justify-center items-center">
          {getIndicator()}
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">{getStateTemplate()}</div>
  );
}
