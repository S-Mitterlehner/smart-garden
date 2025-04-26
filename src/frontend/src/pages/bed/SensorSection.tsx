import { notifications } from "@mantine/notifications";
import useSensors from "../../hooks/useSensors";
import { SensorRef, SensorType } from "../../models/sensor";
import { PlantSensorConfig } from "../../models/plant";
import { useState } from "react";
import { ActionIcon, Drawer } from "@mantine/core";
import SensorList from "../../components/sensors/SensorList";
import SectionTitle from "../../components/SectionTitle";
import { IconBinoculars, IconPlus } from "@tabler/icons-react";
import { CurrentBed } from "../../hooks/useCurrentBed";
import SensorCard from "../../components/sensors/SensorCard";

export type SensorSectionProps = {
  bed: CurrentBed;
};

export default function SensorSection({ bed }: SensorSectionProps) {
  const { addSensor, removeSensor, sensors } = bed!;
  const [showSensorDrawer, setShowSensorDrawer] = useState(false);
  const { data: availableSensors } = useSensors();
  const handleSensorAction = (sensor: SensorRef, action: string) => {
    switch (action) {
      case "remove":
        removeSensor(sensor);
        break;
      case "details":
        notifications.show({
          title: "TODO",
          message: `Show Drawer or Modal?`,
        });
        break;
    }
  };

  const handleSensorAdd = (sensor: SensorRef) => {
    addSensor(sensor);
    setShowSensorDrawer(false);
  };

  const getSensorConfig = (sensorType: SensorType) => {
    const defaultConfig: PlantSensorConfig = {
      sensorType: sensorType,
      rangeFrom: -1,
      rangeTo: -1,
    };

    // if (!plant) return defaultConfig;
    const sensorConfig = bed?.currentPlant?.value?.sensorConfigs?.find(
      (config) => config.sensorType === sensorType
    );

    if (!sensorConfig) return defaultConfig;
    return sensorConfig;
  };

  const sensorActionComponent = (
    <ActionIcon
      variant="subtle"
      size="xl"
      color="oklch(76.5% 0.177 163.223)"
      onClick={() => setShowSensorDrawer(!showSensorDrawer)}
    >
      <IconPlus className="w-6 h-6" />
    </ActionIcon>
  );

  return (
    <>
      <Drawer
        opened={showSensorDrawer}
        position="right"
        offset={15}
        radius={10}
        onClose={() => setShowSensorDrawer(false)}
        title="Add Sensor"
      >
        <SensorList
          sensors={availableSensors}
          disabledSensors={sensors}
          onSelectSensor={handleSensorAdd}
        />
      </Drawer>
      <div>
        <SectionTitle
          title="Sensors"
          actionComponent={sensorActionComponent}
          description="Click on a sensor to see options."
          icon={<IconBinoculars className="w-8 h-8 text-emerald-400" />}
        ></SectionTitle>

        <div className="flex flex-row gap-4 flex-wrap">
          {sensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              plantConfig={getSensorConfig(sensor.type)}
              onAction={handleSensorAction}
            />
          ))}
        </div>
      </div>
    </>
  );
}
