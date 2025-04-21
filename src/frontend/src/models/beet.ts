import { ControllerRef } from "./controller";
import { PlantRef } from "./plant";
import { SensorRef } from "./sensor";

export type BeetRef = {
  id: string;
};

export type Beet = BeetRef & {
  name: string;
  description: string;
  plant: PlantRef;
  sensors: SensorRef[];
  controllers: ControllerRef[];
  imageUrl: string;
};
