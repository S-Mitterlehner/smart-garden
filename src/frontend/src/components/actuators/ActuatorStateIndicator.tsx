import { Tooltip } from "@mantine/core";
import {
  IconHourglassEmpty,
  IconPlugConnectedX,
  IconSettings,
  IconSettingsPause,
  IconWind,
  IconWindOff,
} from "@tabler/icons-react";
import { ActuatorStateDto, ConnectionState, StateType } from "../../__generated__/graphql";
import { ActuatorStateStrings } from "../../models/actuator";
import Gauge from "../Gauge";

export type ActuatorStateProps = {
  state: ActuatorStateDto | null;
  connectionState?: ConnectionState;
};

export default function ActuatorStateIndicator({ state, connectionState }: ActuatorStateProps) {
  const getStateTemplate = () => {
    if (connectionState === ConnectionState.NotConnected)
      return (
        <span className="flex min-h-44 items-center justify-center text-gray-500">
          <Tooltip label="Not connected" withArrow position="top">
            <IconPlugConnectedX className="h-24 w-24" />
          </Tooltip>
        </span>
      );

    if (state === null || (state.state === null && state.value === null))
      return (
        <span className="flex min-h-44 items-center justify-center text-gray-500">
          <Tooltip label="Waiting for Status" withArrow position="top">
            <IconHourglassEmpty className="h-24 w-24" />
          </Tooltip>
        </span>
      );

    if (state.stateType === StateType.Continuous)
      return (
        <span className="min-h-44">
          <Gauge value={state.value!} min={state.min!} max={state.max!} showValue={true} unit={state.unit ?? ""} />
        </span>
      );

    const getIndicator = () => {
      switch (state.state) {
        case ActuatorStateStrings.Open:
          return <IconWind className="h-24 w-24 text-green-50" />;
        case ActuatorStateStrings.Closed:
          return <IconWindOff className="h-24 w-24 text-red-500" />;
        case ActuatorStateStrings.Running:
          return <IconSettings className="h-24 w-24 animate-spin-slow text-green-500" />;
        case ActuatorStateStrings.Stopped:
          return <IconSettingsPause className="h-24 w-24 text-red-500" />;
      }
    };

    return (
      <Tooltip label={state.state} withArrow position="top">
        <div className="flex min-h-44 items-center justify-center">{getIndicator()}</div>
      </Tooltip>
    );
  };

  return <div className="flex flex-col items-center gap-2">{getStateTemplate()}</div>;
}
