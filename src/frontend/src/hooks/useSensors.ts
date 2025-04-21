import { useQuery } from "@tanstack/react-query";
import { Sensor } from "../models/sensor";

export default function useSensors() {
  return useQuery<Sensor[]>({
    queryKey: ["sensors"],
    initialData: [],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/sensors");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
