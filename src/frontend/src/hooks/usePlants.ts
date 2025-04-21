import { useQuery } from "@tanstack/react-query";
import { Plant } from "../models/plant";

export default function usePlants() {
  return useQuery<Plant[]>({
    queryKey: ["plants"],
    initialData: [],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/plants");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
