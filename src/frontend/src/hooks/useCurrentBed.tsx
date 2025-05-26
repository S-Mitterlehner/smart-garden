import { notifications } from "@mantine/notifications";
import { createContext, useContext, useMemo } from "react";
import {
  ActuatorRefDto,
  AutomationRuleDto,
  BedDto,
  PlantDto,
  SensorRefDto,
  useAddActuatorToBedMutation,
  useAddSensorToBedMutation,
  useGetBedByIdQuery,
  useRemoveActuatorFromBedMutation,
  useRemoveSensorFromBedMutation,
  useSetCurrentPlantMutation,
} from "../__generated__/graphql";
import usePlants from "./usePlants";

export type BedValue = {
  bed: BedDto;
  isFetched: boolean;
  currentPlant: {
    value: PlantDto | null;
    set: (plant: PlantDto) => Promise<void>;
  };
  sensors: SensorRefDto[];
  actuators: ActuatorRefDto[];
  rules: AutomationRuleDto[];
  addSensor: (sensor: SensorRefDto) => void;
  removeSensor: (sensor: SensorRefDto) => void;
  addActuator: (actuator: ActuatorRefDto) => void;
  removeActuator: (actuator: ActuatorRefDto) => void;
};

const BedContext = createContext<BedValue | null>(null);

export function BedProvider({ id, children }: { id: string; children: React.ReactNode }) {
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
  const {
    data: { bed } = {},
    loading,
    refetch,
  } = useGetBedByIdQuery({
    variables: { id },
  });

  const [setCurrentPlant] = useSetCurrentPlantMutation();
  const [addSensorMutation] = useAddSensorToBedMutation();
  const [removeSensorMutation] = useRemoveSensorFromBedMutation();
  const [addActuatorMutation] = useAddActuatorToBedMutation();
  const [removeActuatorMutation] = useRemoveActuatorFromBedMutation();

  const { plants = [], isFetched: plantFetched } = usePlants();

  const currentPlant: PlantDto | null = useMemo(() => {
    if (!bed) return null;
    return plants.find((p) => p.id === bed.plant.id) ?? null;
  }, [bed, plants]);

  const addSensor = (sensor: SensorRefDto) => {
    if (!bed) return;

    addSensorMutation({
      variables: { bedId: id, sensorId: sensor.id },
    })
      .then((r) => {
        if (r.data?.addSensorToBed) {
          refetch();
          notifications.show({
            title: "Sensor added",
            message: `Sensor ${sensor.name} added to bed ${bed?.name}`,
            color: "green",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to add sensor ${sensor.name} to bed ${bed?.name}`,
          color: "red",
        });
      });
  };

  const removeSensor = (sensor: SensorRefDto) => {
    if (!bed) return;

    if (!confirm("are you sure?")) return;

    removeSensorMutation({
      variables: { bedId: id, sensorId: sensor.id },
    })
      .then((r) => {
        if (r.data?.removeSensorFromBed) {
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

  const addActuator = (actuator: ActuatorRefDto) => {
    if (!bed) return;

    addActuatorMutation({
      variables: { bedId: id, actuatorId: actuator.id },
    })
      .then((r) => {
        if (r.data?.addActuatorToBed) {
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
          message: `Failed to add actuator ${actuator.name} to bed ${bed.name}`,
          color: "red",
        });
      });
  };

  const removeActuator = (actuator: ActuatorRefDto) => {
    if (!bed) return;

    if (!confirm("are you sure?")) return;

    removeActuatorMutation({
      variables: { bedId: id, actuatorId: actuator.id },
    })
      .then((r) => {
        if (r.data?.removeActuatorFromBed) {
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
    isFetched: !loading && !!bed && plantFetched,
    currentPlant: {
      value: currentPlant,
      set: async (p) => {
        await setCurrentPlant({
          variables: { bedId: bed!.id, plantId: p.id },
        });
        await refetch();
      },
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
