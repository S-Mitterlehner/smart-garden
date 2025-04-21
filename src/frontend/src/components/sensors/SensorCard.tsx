import { Paper } from "@mantine/core";
import { Sensor } from "../../models/sensor";
import { PlantSensorConfig } from "../../models/plant";
import Gauge from "./Gauge";
import Card from "../Card";

export default function SensorCard({
  sensor,
  plantConfig,
}: {
  sensor: Sensor;
  plantConfig: PlantSensorConfig;
}) {
  const rangeFrom = plantConfig?.rangeFrom ?? -1;
  const rangeTo = plantConfig?.rangeTo ?? -1;

  return (
    <Card title={sensor.name}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center">
          <Gauge
            min={sensor.minValue}
            max={sensor.maxValue}
            value={sensor.currentValue}
            rangeFrom={rangeFrom}
            rangeTo={rangeTo}
          ></Gauge>
          <span className="text-2xl font-bold">
            {sensor.currentValue} {sensor.unit}
          </span>
        </div>
        <div className="grid grid-cols-2 text-xs w-full gap-4">
          <span>
            Min: {sensor.minValue} {sensor.unit}
          </span>
          <span className="text-right">
            Max: {sensor.maxValue} {sensor.unit}
          </span>
        </div>
      </div>
    </Card>
  );
}
