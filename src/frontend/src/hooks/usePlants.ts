import { useQuery } from "@tanstack/react-query";
import { Plant } from "../models/plant";
import { API_URL } from "../environment";

export default function usePlants() {
  return useQuery<Plant[]>({
    queryKey: ["plants"],
    initialData: [],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/plants`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
