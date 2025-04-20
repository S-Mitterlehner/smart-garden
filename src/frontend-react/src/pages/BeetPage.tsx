import { useEffect, useState } from "react";
import PlantSelector from "../components/PlantSelector";
import { Plant } from "../models/plant";
import Card from "../components/Card";
import { Sensor } from "../models/sensor";

export default function Beet() {
  const [plant, setPlant] = useState<Plant | null>({
    id: "1",
    name: "Tomato",
    description: "A red fruit",
    imageUrl: "/plants/tomato.svg",
  });

  const [sensors, setSensors] = useState<Sensor[]>([
    {
      id: "1",
      name: "Temperature",
      description: "Temperature sensor",
      currentValue: 25,
      minValue: 0,
      maxValue: 100,
      unit: "°C",
    },
  ]);
  const [controllers, setControllers] = useState([]);

  // useEffect(() => {});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <PlantSelector selectedPlant={plant} setSelectedPlant={setPlant} />
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold">{plant?.name}</span>
          <span className="text-gray-500">{plant?.description}</span>
        </div>
      </div>

      <div>
        <h2>Sensors</h2>
        <div className="flex flex-row gap-4">
          {sensors.map((sensor) => (
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-lg font-bold">{sensor.name}</span>
                <span className="text-gray-500">{sensor.description}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2>Controllers</h2>
      </div>
    </div>
  );
}
