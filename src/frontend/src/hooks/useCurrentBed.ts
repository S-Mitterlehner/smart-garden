import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bed } from "../models/bed";
import usePlants from "./usePlants";
import { Plant } from "../models/plant";
import { useMemo } from "react";
import { SensorRef } from "../models/sensor";
import { ActuatorRef } from "../models/actuator";
import { API_URL } from "../environment";

export type CurrentBed = {
  bed: Bed;
  isFetched: boolean;
  currentPlant: {
    value: Plant | null;
    set: (plant: Plant) => void;
  };
  sensors: SensorRef[];
  actuators: ActuatorRef[];
};

export function useCurrentBed(id: string) {
  const queryClient = useQueryClient();

  const { data: bed, isFetched: bedFetched } = useQuery<Bed | null>({
    queryKey: ["bed", id],
    enabled: !!id,
    refetchOnMount: "always",
    queryFn: async () => {
      const response = await fetch(`${API_URL}/beds/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data: plants = [], isFetched: plantFetched } = usePlants();

  const currentPlant: Plant | null = useMemo(() => {
    if (!bed) return null;
    return plants.find((p) => p.id === bed.plant.id) ?? null;
  }, [bed, plants]);

  const setCurrentPlant = (plant: Plant) => {
    if (!bed) return;
    const updatedbed: Bed = {
      ...bed,
      plant: { ...bed.plant, id: plant.id },
    };
    queryClient.setQueryData(["bed", id], updatedbed);
  };

  return {
    bed,
    isFetched: bedFetched && plantFetched,
    currentPlant: {
      value: currentPlant,
      set: setCurrentPlant,
    },
    sensors: bed?.sensors ?? [],
    actuators: bed?.actuators ?? [],
  } as CurrentBed;
}
