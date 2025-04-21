export enum SensorType {
  TEMPERATURE = "TEMPERATURE",
  HUMIDITY = "HUMIDITY",
  LIGHT = "LIGHT",
}

export type SensorRef = {
  id: string;
};

export type Sensor = SensorRef & {
  name: string;
  description: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
  sensorType: SensorType;
};
