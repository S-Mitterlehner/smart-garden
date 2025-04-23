import { ConnectionState } from "./general";

export enum SensorType {
  TEMPERATURE = "TEMPERATURE",
  HUMIDITY = "HUMIDITY",
  LIGHT = "LIGHT",
}

export type SensorRef = {
  id: string;
  type: SensorType;
  key?: string;
};

export type Sensor = SensorRef & {
  name: string;
  description: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
};

export type SensorData = {
  sensorKey: string;
  connectionState: ConnectionState;
  currentValue: number;
  min: number;
  max: number;
  unit: string;
  lastUpdate: Date;
};
