import { useQuery } from "@tanstack/react-query";
import { useBedContext } from "./useCurrentBed";
import { AutomationConfig } from "../models/automation";

export function useAutomation() {
  const { bed, rules } = useBedContext();

  const { data: config } = useQuery<AutomationConfig>({
    queryKey: ["automation", bed.id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/beds/${bed.id}/rules/config`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch automation");
      }
      return response.json();
    },
    enabled: !!bed,
  });

  return {
    bed,
    rules,
    config,
  };
}
