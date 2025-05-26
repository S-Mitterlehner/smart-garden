import { Tooltip } from "@mantine/core";
import {
  IconHourglassEmpty,
  IconPlugConnectedX,
  IconSettings,
  IconSettingsPause,
  IconWind,
  IconWindOff,
} from "@tabler/icons-react";
import { ConnectionState, ModuleStateDto, PlantModuleConfigDto, StateType } from "../../__generated__/graphql";
import { ModuleStateStrings } from "../../models/module";
import Gauge from "../Gauge";

export type ModuleStateProps = {
  plantConfig?: PlantModuleConfigDto;
  state: ModuleStateDto | ModuleStateDto | null;
  connectionState?: ConnectionState;
};

export default function ModuleStateIndicator({ state, connectionState, plantConfig }: ModuleStateProps) {
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

    if (state.stateType === StateType.Continuous) {
      const rangeFrom = plantConfig?.rangeFrom ?? -1;
      const rangeTo = plantConfig?.rangeTo ?? -1;

      return (
        <Gauge
          min={state.min as number}
          max={state.max as number}
          value={state.value!}
          rangeFrom={rangeFrom}
          rangeTo={rangeTo}
          unit={state.unit as string}
          showValue={true}
        ></Gauge>
      );
    }

    const getIndicator = () => {
      switch (state.state) {
        case ModuleStateStrings.Open:
          return <IconWind className="h-24 w-24 text-green-50" />;
        case ModuleStateStrings.Closed:
          return <IconWindOff className="h-24 w-24 text-red-500" />;
        case ModuleStateStrings.Running:
          return <IconSettings className="h-24 w-24 animate-spin-slow text-green-500" />;
        case ModuleStateStrings.Stopped:
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
