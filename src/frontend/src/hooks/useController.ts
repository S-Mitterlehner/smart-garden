import { useQuery } from "@tanstack/react-query";
import { Controller } from "../models/controller";

export default function useControllers() {
  return useQuery<Controller[]>({
    queryKey: ["controllers"],
    initialData: [],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/controllers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
