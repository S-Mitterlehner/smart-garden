import { notifications } from "@mantine/notifications";
import { createContext, useContext, useMemo } from "react";
import {
  AutomationRuleDto,
  BedDto,
  ModuleGroup,
  ModuleRefDto,
  PlantDto,
  useAddModuleToBedMutation,
  useGetBedByIdQuery,
  useRemoveModuleFromBedMutation,
  useSetCurrentPlantMutation,
} from "../__generated__/graphql";
import { toNiceCasing } from "../utils";
import usePlants from "./usePlants";

export type BedValue = {
  bed: BedDto;
  refetch: any;
  isFetched: boolean;
  currentPlant: {
    value: PlantDto | null;
    set: (plant: PlantDto) => Promise<void>;
  };
  modules: ModuleRefDto[];
  getModulesByGroup: (group: ModuleGroup) => ModuleRefDto[];
  sensors: ModuleRefDto[];
  actuators: ModuleRefDto[];
  rules: AutomationRuleDto[];
  addModule: (sensor: ModuleRefDto) => void;
  removeModule: (sensor: ModuleRefDto) => void;
  addSensor: (sensor: ModuleRefDto) => void;
  removeSensor: (sensor: ModuleRefDto) => void;
  addActuator: (actuator: ModuleRefDto) => void;
  removeActuator: (actuator: ModuleRefDto) => void;
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
  const [addModuleMutation] = useAddModuleToBedMutation();
  const [removeModuleMutation] = useRemoveModuleFromBedMutation();

  const { plants = [], isFetched: plantFetched } = usePlants();

  const currentPlant: PlantDto | null = useMemo(() => {
    if (!bed) return null;
    return plants.find((p) => p.id === bed.plant.id) ?? null;
  }, [bed, plants]);

  const addModule = (module: ModuleRefDto) => {
    if (!bed) return;

    const group = toNiceCasing(module.group);
    addModuleMutation({
      variables: { bedId: id, moduleId: module.id },
    })
      .then((r) => {
        if (r.data?.addModuleToBed) {
          refetch();
          notifications.show({
            title: `${group} added`,
            message: `${group} ${module.name} added to bed ${bed.name}`,
            color: "green",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to add ${group} ${module.name} to bed ${bed.name}`,
          color: "red",
        });
      });
  };

  const removeModule = (module: ModuleRefDto) => {
    if (!bed) return;

    if (!confirm("are you sure?")) return;

    const group = toNiceCasing(module.group);
    removeModuleMutation({
      variables: { bedId: id, moduleId: module.id },
    })
      .then((r) => {
        if (r.data?.removeModuleFromBed) {
          refetch();
          notifications.show({
            title: `${group} removed`,
            message: `${group} ${module.name} removed from bed ${bed.name}`,
            color: "red",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to remove ${group} ${module.name} from bed ${bed.name}`,
          color: "red",
        });
      });
  };

  return {
    bed,
    refetch,
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
    modules: bed?.modules ?? [],
    getModulesByGroup: (group: ModuleGroup) => bed?.modules.filter((x) => x.group === group) ?? [],
    sensors: bed?.modules.filter((x) => x.isSensor) ?? [],
    actuators: bed?.modules.filter((x) => x.isActuator) ?? [],
    rules: bed?.rules ?? [],
    addModule,
    removeModule,
    addSensor: addModule,
    removeSensor: removeModule,
    addActuator: addModule,
    removeActuator: removeModule,
  } as BedValue;
}
