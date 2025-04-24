import PlantSelector from "../components/PlantSelector";
import { useCurrentBed } from "../hooks/useCurrentBed";
import SensorCard from "../components/sensors/SensorCard";
import { PlantSensorConfig } from "../models/plant";
import { SensorRef, SensorType } from "../models/sensor";
import ActuatorCard from "../components/actuators/ActuatorCard";
import { IconBinoculars, IconEngine, IconPlus } from "@tabler/icons-react";
import { useParams } from "react-router";
import { ActionIcon, Drawer } from "@mantine/core";
import { useState } from "react";
import SensorList from "../components/sensors/SensorList";
import useSensors from "../hooks/useSensors";
import SectionTitle from "../components/SectionTitle";
import { notifications } from "@mantine/notifications";

export default function BedPage() {
  const bedId = useParams().bedId as string;
  const {
    isFetched,
    currentPlant: { value: plant, set: setPlant },
    sensors,
    actuators,
    addSensor,
    removeSensor,
  } = useCurrentBed(bedId);

  const { data: availableSensors } = useSensors();
  const [showSensorDrawer, setShowSensorDrawer] = useState(false);

  const getSensorConfig = (sensorType: SensorType) => {
    const defaultConfig: PlantSensorConfig = {
      sensorType: sensorType,
      rangeFrom: -1,
      rangeTo: -1,
    };

    // if (!plant) return defaultConfig;
    const sensorConfig = plant?.sensorConfigs?.find(
      (config) => config.sensorType === sensorType
    );

    if (!sensorConfig) return defaultConfig;
    return sensorConfig;
  };

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

  if (!isFetched) {
    return <div>Loading...</div>;
    //TODO: make a loading spinner or skeleton
  }

  const actionComponent = (
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
        offset={5}
        radius={5}
        onClose={() => setShowSensorDrawer(false)}
        title="Add Sensor"
      >
        <SensorList
          sensors={availableSensors}
          disabledSensors={sensors}
          onSelectSensor={handleSensorAdd}
        />
      </Drawer>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <PlantSelector selectedPlant={plant} setSelectedPlant={setPlant} />
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-bold">{plant?.name}</span>
            <span className="text-gray-500">{plant?.description}</span>
          </div>
        </div>

        <div>
          <SectionTitle
            title="Sensors"
            actionComponent={actionComponent}
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

        <div>
          <SectionTitle
            title="Actuators"
            icon={<IconEngine className="w-8 h-8 text-emerald-400" />}
          ></SectionTitle>

          <div className="flex flex-row gap-4">
            {actuators.map((actuator) => (
              <ActuatorCard key={actuator.id} actuator={actuator} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
