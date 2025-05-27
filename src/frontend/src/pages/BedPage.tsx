import { ActionIcon, Drawer, Loader } from "@mantine/core";
import { IconAutomaticGearbox } from "@tabler/icons-react";
import { useState } from "react";
import { useParams } from "react-router";
import { ModuleGroup } from "../__generated__/graphql";
import RuleList from "../components/automation/RuleList";
import ModuleSection from "../components/modules/ModuleSection";
import PlantSelector from "../components/plants/PlantSelector";
import { AutomationProvider } from "../hooks/useAutomation";
import { BedProvider, useBedContext } from "../hooks/useCurrentBed";

export default function BedPage() {
  const bedId = useParams().bedId as string;

  return <BedProvider id={bedId}>{<BedPageContent />}</BedProvider>;
}

export function BedPageContent() {
  const {
    isFetched,
    currentPlant: { value: plant, set: setPlant },
  } = useBedContext();
  const [showRulesDrawer, setShowRulesDrawer] = useState(false);

  if (!isFetched) {
    return (
      <div className="mx-auto mt-20 flex flex-col items-center justify-center gap-4">
        <Loader size="xl" type="dots" color="emerald" />
        <span className="text-2xl font-thin">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4">
          <PlantSelector selectedPlant={plant} setSelectedPlant={setPlant} />
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-bold">{plant?.name}</span>
            <span className="text-gray-500">{plant?.description}</span>
          </div>
          <div className="justify-self-end">
            <ActionIcon
              variant="subtle"
              size="xl"
              color="oklch(76.5% 0.177 163.223)"
              onClick={() => setShowRulesDrawer(!showRulesDrawer)}
            >
              <IconAutomaticGearbox className="h-6 w-6" />
            </ActionIcon>
          </div>
        </div>

        {/* <SensorSection /> */}
        {/* <ActuatorSection /> */}
        <ModuleSection group={ModuleGroup.Sensor} />
        <ModuleSection group={ModuleGroup.Actuator} />
      </div>

      <Drawer
        opened={showRulesDrawer}
        position="right"
        size="xl"
        offset={15}
        radius={10}
        onClose={() => setShowRulesDrawer(false)}
      >
        <AutomationProvider>
          <RuleList />
        </AutomationProvider>
      </Drawer>
    </>
  );
}
