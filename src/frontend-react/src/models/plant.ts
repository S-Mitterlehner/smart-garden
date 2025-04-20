export type PlantRef = {
  id: string;
};

export type Plant = PlantRef & {
  name: string;
  description: string;
  imageUrl: string;
};
