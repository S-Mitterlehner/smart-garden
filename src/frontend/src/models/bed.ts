import { ActuatorRef } from "./actuator";
import { AutomationRule } from "./automation";
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
  actuators: ActuatorRef[];
  rules: AutomationRule[];
};
