import { ControllerRef } from "./controller";
import { PlantRef } from "./plant";
import { SensorRef } from "./sensor";

export type BedRef = {
  id: string;
};

export type Bed = BedRef & {
  name: string;
  description: string;
  plant: PlantRef;
  sensors: SensorRef[];
  controllers: ControllerRef[];
  imageUrl: string;
};
