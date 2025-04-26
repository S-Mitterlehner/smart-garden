import PlantSelector from "../../components/PlantSelector";
import { useCurrentBed } from "../../hooks/useCurrentBed";
import { useParams } from "react-router";
import SensorSection from "./SensorSection";
import ActuatorSection from "./ActuatorSection";
import { Loader } from "@mantine/core";

export default function BedPage() {
  const bedId = useParams().bedId as string;
  const bed = useCurrentBed(bedId);
  const {
    isFetched,
    currentPlant: { value: plant, set: setPlant },
  } = bed;

  if (!isFetched) {
    return (
      <div className="mx-auto mt-20 flex flex-col gap-4 items-center justify-center">
        <Loader size="xl" type="dots" color="oklch(69.6% 0.17 162.48)" />
        <span className="text-2xl font-thin">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <PlantSelector selectedPlant={plant} setSelectedPlant={setPlant} />
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold">{plant?.name}</span>
          <span className="text-gray-500">{plant?.description}</span>
        </div>
      </div>

      <SensorSection bed={bed} />
      <ActuatorSection bed={bed} />
    </div>
  );
}
