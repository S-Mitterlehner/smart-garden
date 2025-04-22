import { useQuery } from "@tanstack/react-query";
import { Actuator } from "../models/actuator";
import { API_URL } from "../environment";

export default function useActuators() {
  return useQuery<Actuator[]>({
    queryKey: ["actuators"],
    initialData: [],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/actuators`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
