import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Beet } from "../models/beet";
import usePlants from "./usePlants";
import { Plant } from "../models/plant";
import { useMemo } from "react";
import { SensorRef } from "../models/sensor";
import { ControllerRef } from "../models/controller";
import { API_URL } from "../environment";

export type CurrentBeet = {
  beet: Beet;
  isFetched: boolean;
  currentPlant: {
    value: Plant | null;
    set: (plant: Plant) => void;
  };
  sensors: SensorRef[];
  controllers: ControllerRef[];
};

export function useCurrentBeet(id: string) {
  const queryClient = useQueryClient();

  const { data: beet, isFetched: beetFetched } = useQuery<Beet | null>({
    queryKey: ["beet", id],
    enabled: !!id,
    refetchOnMount: "always",
    queryFn: async () => {
      const response = await fetch(`${API_URL}/beets/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data: plants = [], isFetched: plantFetched } = usePlants();

  const currentPlant: Plant | null = useMemo(() => {
    if (!beet) return null;
    return plants.find((p) => p.id === beet.plant.id) ?? null;
  }, [beet, plants]);

  const setCurrentPlant = (plant: Plant) => {
    if (!beet) return;
    const updatedBeet: Beet = {
      ...beet,
      plant: { ...beet.plant, id: plant.id },
    };
    queryClient.setQueryData(["beet", id], updatedBeet);
  };

  return {
    beet,
    isFetched: beetFetched && plantFetched,
    currentPlant: {
      value: currentPlant,
      set: setCurrentPlant,
    },
    sensors: beet?.sensors ?? [],
    controllers: beet?.controllers ?? [],
  } as CurrentBeet;
}
