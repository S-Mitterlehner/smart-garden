import { useQuery } from "@tanstack/react-query";
import { Controller } from "../models/controller";
import { API_URL } from "../environment";

export default function useControllers() {
  return useQuery<Controller[]>({
    queryKey: ["controllers"],
    initialData: [],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/controllers`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
