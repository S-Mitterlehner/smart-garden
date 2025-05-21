import { ActionIcon, Drawer } from "@mantine/core";
import { IconBinoculars, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { ModuleType, PlantSensorConfigDto, SensorDto, SensorRefDto } from "../../__generated__/graphql";
import SectionTitle from "../../components/SectionTitle";
import SensorCard from "../../components/sensors/SensorCard";
import SensorList from "../../components/sensors/SensorList";
import { useBedContext } from "../../hooks/useCurrentBed";
import { SensorProvider } from "../../hooks/useSensor";
import useSensors from "../../hooks/useSensors";

export default function SensorSection() {
  const { addSensor, removeSensor, sensors, currentPlant } = useBedContext();
  const [showSensorDrawer, setShowSensorDrawer] = useState(false);
  const { sensors: availableSensors } = useSensors();
  const handleSensorAction = (sensor: SensorDto, action: string) => {
    switch (action) {
      case "remove":
        removeSensor(sensor as SensorRefDto);
        break;
    }
  };

  const handleSensorAdd = (sensor: SensorRefDto) => {
    addSensor(sensor);
    setShowSensorDrawer(false);
  };

  const getSensorConfig = (sensorType: ModuleType) => {
    const defaultConfig: PlantSensorConfigDto = {
      sensorType: sensorType,
      rangeFrom: -1,
      rangeTo: -1,
    };

    const sensorConfig = currentPlant?.value?.sensorConfigs?.find((config) => config.sensorType === sensorType);

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
      <IconPlus className="h-6 w-6" />
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
        <SensorList sensors={availableSensors} disabledSensors={sensors} onSelectSensor={handleSensorAdd} />
      </Drawer>
      <div>
        <SectionTitle
          title="Sensors"
          actionComponent={sensorActionComponent}
          description="Click on a sensor to see options."
          icon={<IconBinoculars className="h-8 w-8 text-emerald-400" />}
        ></SectionTitle>

        <div className="flex flex-row flex-wrap gap-4">
          {sensors.map((sensor) => (
            <SensorProvider key={sensor.id} sensorId={sensor.id}>
              <SensorCard plantConfig={getSensorConfig(sensor.type)} onAction={handleSensorAction} />
            </SensorProvider>
          ))}

          <button
            onClick={() => setShowSensorDrawer(true)}
            className="relative flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-300 p-4 hover:bg-gray-200 phone:w-64"
          >
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4">
              <IconPlus className="h-12 w-12 text-gray-400" />
              <span className="text-sm text-gray-400">Add Sensor</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
