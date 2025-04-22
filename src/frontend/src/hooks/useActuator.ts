import { useQuery } from "@tanstack/react-query";
import { Actuator, ActuatorAction, ActuatorState } from "../models/actuator";
import { API_URL } from "../environment";
import { ConnectionState } from "../models/general";
import { useState } from "react";

export type ActuatorValue = {
  actuator: Actuator;
  state: ActuatorState;
  canDoAction: boolean;
  startAction: (action: ActuatorAction, value?: number) => void;
};

export default function useActuator(actuatorId: string): ActuatorValue {
  const [loading, setLoading] = useState(false);
  const {
    data: actuator,
    refetch,
    isFetched,
  } = useQuery<Actuator>({
    queryKey: ["actuator", actuatorId],
    enabled: !!actuatorId,
    refetchOnMount: "always",
    queryFn: async () => {
      const response = await fetch(`${API_URL}/actuators/${actuatorId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return {
    actuator: actuator ?? ({} as Actuator),
    state: actuator?.state ?? ({} as ActuatorState),
    canDoAction:
      isFetched &&
      actuator?.state.connectionState === ConnectionState.Connected &&
      !loading,
    startAction: async (action: ActuatorAction, value?: number) => {
      setLoading(true);
      const r = await fetch(
        `${API_URL}/actuators/${actuatorId}/action/${action.key}${
          !!value ? `?value=${value}` : ""
        }`,
        {
          method: "HEAD",
        }
      );
      if (r.ok) {
        refetch();
        setLoading(false);
      }
    },
  };
}
