import { ActionIcon, Drawer } from "@mantine/core";
import { IconEngine, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import ActuatorCard from "../../components/actuators/ActuatorCard";
import ActuatorList from "../../components/actuators/ActuatorList";
import SectionTitle from "../../components/SectionTitle";
import { ActuatorProvider } from "../../hooks/useActuator";
import useActuators from "../../hooks/useActuators";
import { useBedContext } from "../../hooks/useCurrentBed";
import { ActuatorRef } from "../../models/actuator";

export default function ActuatorSection() {
  const { addActuator, removeActuator, actuators } = useBedContext();
  const { actuators: availableActuators } = useActuators();
  const [showActuatorDrawer, setShowActuatorDrawer] = useState(false);
  const handleActuatorAction = (actuator: ActuatorRef, action: string) => {
    switch (action) {
      case "remove":
        removeActuator(actuator);
        break;
    }
  };

  const handleActuatorAdd = (actuator: ActuatorRef) => {
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
          {actuators.map((actuator) => (
            <ActuatorProvider key={actuator.id} actuatorId={actuator.id}>
              <ActuatorCard onMenuAction={handleActuatorAction} />
            </ActuatorProvider>
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
