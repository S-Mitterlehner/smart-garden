import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Beet } from "../models/beet";
import usePlants from "./usePlants";
import { Plant } from "../models/plant";
import { useMemo } from "react";
import { Sensor, SensorRef } from "../models/sensor";
import { Controller, ControllerRef } from "../models/controller";
import useSensors from "./useSensors";
import useControllers from "./useController";

export type CurrentBeet = {
  beet: Beet;
  isFetched: boolean;
  currentPlant: {
    value: Plant | null;
    set: (plant: Plant) => void;
  };
  sensors: Sensor[];
  controllers: Controller[];
};

export function useCurrentBeet(id: string) {
  const queryClient = useQueryClient();

  const { data: beet, isFetched: beetFetched } = useQuery<Beet | null>({
    queryKey: ["beet", id],
    enabled: !!id,
    refetchOnMount: "always",
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/beets/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data: plants = [], isFetched: plantFetched } = usePlants();
  const { data: sensors = [], isFetched: sensorFetched } = useSensors();
  const { data: controllers = [], isFetched: controllerFetched } =
    useControllers();

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

  const beetSensors: Sensor[] = useMemo(() => {
    if (!beet) return [];
    return sensors.filter((s) =>
      beet.sensors.some((ref: SensorRef) => ref.id === s.id)
    );
  }, [beet, sensors]);

  const beetControllers: Controller[] = useMemo(() => {
    if (!beet) return [];
    return controllers.filter((c) =>
      beet.controllers.some((ref: ControllerRef) => ref.id === c.id)
    );
  }, [beet, controllers]);

  return {
    beet,
    isFetched:
      beetFetched && plantFetched && sensorFetched && controllerFetched,
    currentPlant: {
      value: currentPlant,
      set: setCurrentPlant,
    },
    sensors: beetSensors,
    controllers: beetControllers,
  } as CurrentBeet;
}
