import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bed } from "../models/bed";
import usePlants from "./usePlants";
import { Plant } from "../models/plant";
import { createContext, useContext, useMemo } from "react";
import { SensorRef } from "../models/sensor";
import { ActuatorRef } from "../models/actuator";
import { API_URL } from "../environment";
import { notifications } from "@mantine/notifications";
import { AutomationRule } from "../models/automation";

export type BedValue = {
  bed: Bed;
  isFetched: boolean;
  currentPlant: {
    value: Plant | null;
    set: (plant: Plant) => void;
  };
  sensors: SensorRef[];
  actuators: ActuatorRef[];
  rules: AutomationRule[];
  addSensor: (sensor: SensorRef) => void;
  removeSensor: (sensor: SensorRef) => void;
  addActuator: (actuator: ActuatorRef) => void;
  removeActuator: (actuator: ActuatorRef) => void;
};

const BedContext = createContext<BedValue | null>(null);

export function BedProvider({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const bed = useBed(id);

  return <BedContext.Provider value={bed}>{children}</BedContext.Provider>;
}

export function useBedContext(): BedValue {
  const context = useContext(BedContext);
  if (!context) {
    throw new Error("useBed must be used within a BedProvider");
  }
  return context;
}

export function useBed(id: string) {
  const queryClient = useQueryClient();

  const {
    data: bed,
    isFetched: bedFetched,
    refetch,
  } = useQuery<Bed | null>({
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

  const addSensor = (sensor: SensorRef) => {
    if (!bed) return;

    fetch(`${API_URL}/beds/${id}/sensors/${sensor.id}`, {
      method: "PATCH",
    })
      .then((r) => {
        if (r.status === 200) {
          refetch();
          notifications.show({
            title: "Sensor added",
            message: `Sensor ${sensor.name} added to bed ${bed.name}`,
            color: "green",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to add sensor ${sensor.name} to bed ${bed.name}`,
          color: "red",
        });
      });
  };

  const removeSensor = (sensor: SensorRef) => {
    if (!bed) return;

    if (!confirm("are you sure?")) return;

    fetch(`${API_URL}/beds/${id}/sensors/${sensor.id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.status === 200) {
          refetch();
          notifications.show({
            title: "Sensor removed",
            message: `Sensor ${sensor.name} removed from bed ${bed.name}`,
            color: "red",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to remove sensor ${sensor.name} from bed ${bed.name}`,
          color: "red",
        });
      });
  };

  const addActuator = (actuator: ActuatorRef) => {
    if (!bed) return;

    fetch(`${API_URL}/beds/${id}/Actuators/${actuator.id}`, {
      method: "PATCH",
    })
      .then((r) => {
        if (r.status === 200) {
          refetch();
          notifications.show({
            title: "Actuator added",
            message: `Actuator ${actuator.name} added to bed ${bed.name}`,
            color: "green",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to add Actuator ${actuator.name} to bed ${bed.name}`,
          color: "red",
        });
      });
  };

  const removeActuator = (actuator: ActuatorRef) => {
    if (!bed) return;

    if (!confirm("are you sure?")) return;

    fetch(`${API_URL}/beds/${id}/actuators/${actuator.id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.status === 200) {
          refetch();
          notifications.show({
            title: "Actuator removed",
            message: `Actuator ${actuator.name} removed from bed ${bed.name}`,
            color: "red",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to remove actuator ${actuator.name} from bed ${bed.name}`,
          color: "red",
        });
      });
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
    rules: bed?.rules ?? [],
    addSensor,
    removeSensor,
    addActuator,
    removeActuator,
  } as BedValue;
}
