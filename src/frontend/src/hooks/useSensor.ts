import { useQuery } from "@tanstack/react-query";
import { Sensor } from "../models/sensor";
import { API_URL } from "../environment";

export type SensorValue = {
  isFetched: boolean;
  sensor: Sensor;
  currentValue: number | null;
};

export default function useSensor(sensorId: string): SensorValue {
  const { data: sensor, isFetched } = useQuery<Sensor | null>({
    queryKey: ["sensor", sensorId],
    enabled: !!sensorId,
    refetchOnMount: "always",
    initialData: null,
    queryFn: async () => {
      const response = await fetch(`${API_URL}/sensors/${sensorId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return {
    isFetched,
    sensor: sensor ?? ({} as Sensor),
    currentValue: sensor?.currentValue ?? sensor?.minValue ?? 0,
  };
}
