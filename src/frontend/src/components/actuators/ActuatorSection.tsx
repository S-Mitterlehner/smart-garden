import { ActionIcon, Drawer } from "@mantine/core";
import { IconEngine, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { ModuleRefDto, ModuleTypeGroup } from "../../__generated__/graphql";
import ActuatorCard from "../../components/actuators/ActuatorCard";
import ActuatorList from "../../components/actuators/ActuatorList";
import SectionTitle from "../../components/SectionTitle";
import { useBedContext } from "../../hooks/useCurrentBed";
import { ModuleProvider } from "../../hooks/useModule";
import useModules from "../../hooks/useModules";

export default function ActuatorSection() {
  const { addActuator, removeActuator, actuators } = useBedContext();
  const { modules: availableActuators } = useModules(ModuleTypeGroup.Actuator);
  const [showActuatorDrawer, setShowActuatorDrawer] = useState(false);
  const handleActuatorAction = (actuator: ModuleRefDto, action: string) => {
    switch (action) {
      case "remove":
        removeActuator(actuator);
        break;
    }
  };

  const handleActuatorAdd = (actuator: ModuleRefDto) => {
    addActuator(actuator);
    setShowActuatorDrawer(false);
  };
  const actuatorActionComponent = (
    <ActionIcon
      variant="subtle"
      size="xl"
      color="oklch(76.5% 0.177 163.223)"
      onClick={() => setShowActuatorDrawer(!showActuatorDrawer)}
    >
      <IconPlus className="h-6 w-6" />
    </ActionIcon>
  );
  return (
    <>
      <Drawer
        opened={showActuatorDrawer}
        position="right"
        offset={15}
        radius={10}
        onClose={() => setShowActuatorDrawer(false)}
        title="Add Actuator"
      >
        <ActuatorList
          Actuators={availableActuators}
          disabledActuators={actuators}
          onSelectActuator={handleActuatorAdd}
        />
      </Drawer>

      <div>
        <SectionTitle
          title="Actuators"
          actionComponent={actuatorActionComponent}
          description="Click on an actuator to see actions and options."
          icon={<IconEngine className="h-8 w-8 text-emerald-400" />}
        ></SectionTitle>

        <div className="flex flex-row flex-wrap gap-4">
          {actuators.map((module) => (
            <ModuleProvider key={module.id} moduleId={module.id}>
              <ActuatorCard onMenuAction={handleActuatorAction} />
            </ModuleProvider>
          ))}
          <button
            onClick={() => setShowActuatorDrawer(true)}
            className="relative flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-300 p-4 hover:bg-gray-200 phone:w-64"
          >
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4">
              <IconPlus className="h-12 w-12 text-gray-400" />
              <span className="text-sm text-gray-400">Add Actuator</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
