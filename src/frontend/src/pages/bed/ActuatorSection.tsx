import { ActionIcon, Drawer } from "@mantine/core";
import SectionTitle from "../../components/SectionTitle";
import useActuators from "../../hooks/useActuators";
import { useState } from "react";
import { ActuatorRef } from "../../models/actuator";
import { CurrentBed } from "../../hooks/useCurrentBed";
import { notifications } from "@mantine/notifications";
import { IconEngine, IconPlus } from "@tabler/icons-react";
import ActuatorList from "../../components/actuators/ActuatorList";
import ActuatorCard from "../../components/actuators/ActuatorCard";

export default function ActuatorSection({ bed }: { bed: CurrentBed }) {
  const { addActuator, removeActuator, actuators } = bed!;
  const { data: availableActuators } = useActuators();
  const [showActuatorDrawer, setShowActuatorDrawer] = useState(false);
  const handleActuatorAction = (actuator: ActuatorRef, action: string) => {
    switch (action) {
      case "remove":
        removeActuator(actuator);
        break;
      case "details":
        notifications.show({
          title: "TODO",
          message: `Show Drawer or Modal?`,
        });
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
            <ActuatorCard
              key={actuator.id}
              actuator={actuator}
              onMenuAction={handleActuatorAction}
            />
          ))}
        </div>
      </div>
    </>
  );
}
