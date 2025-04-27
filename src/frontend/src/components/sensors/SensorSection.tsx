import useSensors from "../../hooks/useSensors";
import { SensorRef, SensorType } from "../../models/sensor";
import { PlantSensorConfig } from "../../models/plant";
import { useState } from "react";
import { ActionIcon, Drawer } from "@mantine/core";
import SensorList from "../../components/sensors/SensorList";
import SectionTitle from "../../components/SectionTitle";
import { IconBinoculars, IconPlus } from "@tabler/icons-react";
import { useBedContext } from "../../hooks/useCurrentBed";
import SensorCard from "../../components/sensors/SensorCard";
import { SensorProvider } from "../../hooks/useSensor";

export default function SensorSection() {
  const { addSensor, removeSensor, sensors, currentPlant } = useBedContext();
  const [showSensorDrawer, setShowSensorDrawer] = useState(false);
  const { data: availableSensors } = useSensors();
  const handleSensorAction = (sensor: SensorRef, action: string) => {
    switch (action) {
      case "remove":
        removeSensor(sensor);
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

    const sensorConfig = currentPlant?.value?.sensorConfigs?.find(
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
            <SensorProvider key={sensor.id} sensorId={sensor.id}>
              <SensorCard
                plantConfig={getSensorConfig(sensor.type)}
                onAction={handleSensorAction}
              />
            </SensorProvider>
          ))}

          <button
            onClick={() => setShowSensorDrawer(true)}
            className="w-full phone:w-64 min-h-32 relative border-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-gray-200 cursor-pointer"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center justify-center">
              <IconPlus className="w-12 h-12 text-gray-400 " />
              <span className="text-gray-400 text-sm">Add Sensor</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
