export enum SensorType {
  TEMPERATURE = "TEMPERATURE",
  HUMIDITY = "HUMIDITY",
  LIGHT = "LIGHT",
}

export type SensorRef = {
  id: string;
  type: SensorType;
};

export type Sensor = SensorRef & {
  name: string;
  description: string;
  minValue: number;
  maxValue: number;
  unit: string;
};
