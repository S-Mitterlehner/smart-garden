import { SensorRef } from "../../models/sensor";
import { PlantSensorConfig } from "../../models/plant";
import {
  IconHourglassEmpty,
  IconListDetails,
  IconPlugConnectedX,
  IconTrash,
} from "@tabler/icons-react";
import Gauge from "../Gauge";
import Card from "../Card";
import useSensor from "../../hooks/useSensor";
import { ConnectionState } from "../../models/general";
import { Menu, Tooltip } from "@mantine/core";
import { getTypeIconCircle } from "./utils";
import { getTimeString } from "../../utils";

export default function SensorCard({
  sensor: sensorRef,
  plantConfig,
  onAction,
}: {
  sensor: SensorRef;
  plantConfig: PlantSensorConfig;
  onAction: (sensor: SensorRef, action: string, actionData?: unknown) => void;
}) {
  const { sensor, currentState, isFetched, connectionState } = useSensor(
    sensorRef.id
  );

  const rangeFrom = plantConfig?.rangeFrom ?? -1;
  const rangeTo = plantConfig?.rangeTo ?? -1;

  const getGauge = () => {
    if (!isFetched || connectionState === ConnectionState.NotConnected)
      return (
        <Tooltip label="Not Connected" withArrow position="top">
          <IconPlugConnectedX className="w-24 h-24 text-gray-500" />
        </Tooltip>
      );

    if (currentState === null) {
      return (
        <Tooltip label="Waiting for Status" withArrow position="top">
          <IconHourglassEmpty className="w-24 h-24" />
        </Tooltip>
      );
    }
    return (
      <Gauge
        min={currentState.min}
        max={currentState.max}
        value={currentState.currentValue!}
        rangeFrom={rangeFrom}
        rangeTo={rangeTo}
        unit={currentState.unit}
        showValue={true}
      ></Gauge>
    );
  };

  const getRangeString = () => {
    if (rangeFrom > -1 && rangeTo > -1)
      return `${rangeFrom} - ${rangeTo} ${sensor.unit}`;
    else return "not defined";
  };

  return (
    <Menu shadow="md">
      <Menu.Target>
        <button className="text-left cursor-pointer w-full phone:w-auto">
          <Card
            title={sensor.name}
            className=" hover:bg-gray-50!"
            icon={
              <Tooltip label={sensor.type} position="top" withArrow>
                {getTypeIconCircle(sensor.type)}
              </Tooltip>
            }
            right={
              <div className="flex flex-col text-xs text-right">
                <span className="text-gray-400">Last Update: </span>
                <span>{getTimeString(currentState?.lastUpdate)}</span>
              </div>
            }
          >
            <div className="flex flex-col items-center gap-2">
              <div className="min-h-44 flex justify-center items-center">
                {getGauge()}
              </div>

              <div className="grid grid-cols-2 text-xs w-full gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-400">Target: </span>
                  <span>{getRangeString()}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-gray-400">Sensor:</span>
                  <span>
                    {currentState?.min ?? sensor.minValue} -{" "}
                    {currentState?.max ?? sensor.maxValue} {sensor.unit}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => onAction(sensorRef, "details")}
          leftSection={<IconListDetails className="w-4 h-4" />}
        >
          View Sensor Details
        </Menu.Item>
        <Menu.Item
          onClick={() => onAction(sensorRef, "remove")}
          color="red"
          leftSection={<IconTrash className="w-4 h-4" />}
        >
          Remove Sensor from Bed
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
