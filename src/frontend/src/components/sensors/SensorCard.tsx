import { SensorRef } from "../../models/sensor";
import { PlantSensorConfig } from "../../models/plant";
import {
  IconListDetails,
  IconPlugConnectedX,
  IconTrash,
} from "@tabler/icons-react";
import Gauge from "../Gauge";
import Card from "../Card";
import useSensor from "../../hooks/useSensor";
import { ConnectionState } from "../../models/general";
import { Menu } from "@mantine/core";

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
    if (connectionState === ConnectionState.Connected && isFetched) {
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
    } else {
      return <IconPlugConnectedX className="w-24 h-24 text-gray-500" />;
    }
  };

  const getRangeString = () => {
    if (rangeFrom > -1 && rangeTo > -1)
      return `${rangeFrom} - ${rangeTo} ${sensor.unit}`;
    else return "not defined";
  };

  const getTimeString = () => {
    if (currentState.lastUpdate) {
      const date = new Date(currentState.lastUpdate);
      const format = (t: number) => `00${t}`.slice(-2);

      return `${format(date.getHours())}:${format(date.getMinutes())}:${format(
        date.getSeconds()
      )}`;
    } else {
      return "not available";
    }
  };

  return (
    <Menu shadow="md">
      <Menu.Target>
        <button className="text-left cursor-pointer w-full phone:w-auto">
          <Card title={sensor.name} className=" hover:bg-gray-50!">
            <div className="flex flex-col text-xs absolute top-3 right-2 text-right">
              <span className="text-gray-400">Last Update: </span>
              <span>{getTimeString()}</span>
            </div>

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
                    {currentState.min} - {currentState.max} {sensor.unit}
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
