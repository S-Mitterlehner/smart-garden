import PlantSelector from "../components/PlantSelector";
import { BedProvider, useBedContext } from "../hooks/useCurrentBed";
import { useParams } from "react-router";
import { Loader } from "@mantine/core";
import SensorSection from "../components/sensors/SensorSection";
import ActuatorSection from "../components/actuators/ActuatorSection";

export default function BedPage() {
  const bedId = useParams().bedId as string;

  return <BedProvider id={bedId}>{<BedPageContent />}</BedProvider>;
}

export function BedPageContent() {
  const {
    isFetched,
    currentPlant: { value: plant, set: setPlant },
  } = useBedContext();

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

      <SensorSection />
      <ActuatorSection />
    </div>
  );
}
