import { Drawer, Menu, Tooltip } from "@mantine/core";
import { IconHourglassEmpty, IconListDetails, IconPlugConnectedX, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { ConnectionState, PlantSensorConfigDto, SensorDto } from "../../__generated__/graphql";
import { useSensorContext } from "../../hooks/useSensor";
import { getTimeString } from "../../utils";
import Card from "../Card";
import Gauge from "../Gauge";
import SensorProperties from "./SensorProperties";
import { getTypeIconCircle } from "./utils";

export default function SensorCard({
  // sensor: sensorRef,
  plantConfig,
  onAction,
}: {
  // sensor: SensorRef;
  plantConfig: PlantSensorConfigDto;
  onAction: (sensor: SensorDto, action: string, actionData?: unknown) => void;
}) {
  const { sensor, currentState, isFetched, connectionState } = useSensorContext();
  const [showPropertiesDrawer, setShowPropertiesDrawer] = useState(false);

  const rangeFrom = plantConfig?.rangeFrom ?? -1;
  const rangeTo = plantConfig?.rangeTo ?? -1;

  const getGauge = () => {
    if (!isFetched || connectionState === ConnectionState.NotConnected)
      return (
        <Tooltip label="Not Connected" withArrow position="top">
          <IconPlugConnectedX className="h-24 w-24 text-gray-500" />
        </Tooltip>
      );

    if (currentState === null || currentState.currentValue === null) {
      return (
        <Tooltip label="Waiting for Status" withArrow position="top">
          <IconHourglassEmpty className="h-24 w-24 text-gray-500" />
        </Tooltip>
      );
    }
    return (
      <Gauge
        min={currentState.min as number}
        max={currentState.max as number}
        value={currentState.currentValue!}
        rangeFrom={rangeFrom}
        rangeTo={rangeTo}
        unit={currentState.unit as string}
        showValue={true}
      ></Gauge>
    );
  };

  const getRangeString = () => {
    if (rangeFrom > -1 && rangeTo > -1) return `${rangeFrom} - ${rangeTo} ${sensor.unit ?? ""}`;
    else return "not defined";
  };

  return (
    <>
      <Drawer
        opened={showPropertiesDrawer}
        onClose={() => setShowPropertiesDrawer(false)}
        offset={15}
        radius={10}
        position="right"
      >
        <SensorProperties />
      </Drawer>
      <Menu shadow="md">
        <Menu.Target>
          <button className="w-full cursor-pointer text-left phone:w-auto">
            <Card
              title={sensor.name}
              className="hover:bg-gray-50!"
              icon={
                <Tooltip label={sensor.type} position="top" withArrow>
                  {getTypeIconCircle(sensor.type)}
                </Tooltip>
              }
              right={
                <div className="flex flex-col text-right text-xs">
                  <span className="text-gray-400">Last Update: </span>
                  <span>{getTimeString(currentState?.lastUpdate)}</span>
                </div>
              }
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex min-h-44 items-center justify-center">{getGauge()}</div>

                <div className="grid w-full grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col">
                    <span className="text-gray-400">Target: </span>
                    <span>{getRangeString()}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-400">Sensor:</span>
                    <span>
                      {currentState?.min ?? sensor.minValue} - {currentState?.max ?? sensor.maxValue}{" "}
                      {sensor.unit ?? ""}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => setShowPropertiesDrawer(true)}
            leftSection={<IconListDetails className="h-4 w-4" />}
          >
            View Sensor Details
          </Menu.Item>
          <Menu.Item
            onClick={() => onAction(sensor, "remove")}
            color="red"
            leftSection={<IconTrash className="h-4 w-4" />}
          >
            Remove Sensor from Bed
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
