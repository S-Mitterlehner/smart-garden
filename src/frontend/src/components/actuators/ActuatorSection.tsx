import { ActionIcon, Drawer } from "@mantine/core";
import SectionTitle from "../../components/SectionTitle";
import useActuators from "../../hooks/useActuators";
import { useState } from "react";
import { ActuatorRef } from "../../models/actuator";
import { useBedContext } from "../../hooks/useCurrentBed";
import { IconEngine, IconPlus } from "@tabler/icons-react";
import ActuatorList from "../../components/actuators/ActuatorList";
import ActuatorCard from "../../components/actuators/ActuatorCard";
import { ActuatorProvider } from "../../hooks/useActuator";

export default function ActuatorSection() {
  const { addActuator, removeActuator, actuators } = useBedContext();
  const { data: availableActuators } = useActuators();
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
      <IconPlus className="w-6 h-6" />
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
          icon={<IconEngine className="w-8 h-8 text-emerald-400" />}
        ></SectionTitle>

        <div className="flex flex-row gap-4 flex-wrap">
          {actuators.map((actuator) => (
            <ActuatorProvider key={actuator.id} actuatorId={actuator.id}>
              <ActuatorCard onMenuAction={handleActuatorAction} />
            </ActuatorProvider>
          ))}
          <button
            onClick={() => setShowActuatorDrawer(true)}
            className="w-full phone:w-64 min-h-32 relative border-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-gray-200 cursor-pointer"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center justify-center">
              <IconPlus className="w-12 h-12 text-gray-400 " />
              <span className="text-gray-400 text-sm">Add Actuator</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
