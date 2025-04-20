import { PlantRef } from './plant';

export interface Beet {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  plant: PlantRef;
}
