export interface PlantRef {
  id: string;
}

export interface Plant extends PlantRef {
  name: string;
  description: string | null;
  imageUrl: string;
}
