import { SensorType } from "./sensor";

export type PlantRef = {
  id: string;
};

export type Plant = PlantRef & {
  name: string;
  description: string;
  imageUrl: string;
  sensorConfig: PlantSensorConfig[];
};

export type PlantSensorConfig = {
  sensorType: SensorType;
  rangeFrom?: number;
  rangeTo?: number;
};
