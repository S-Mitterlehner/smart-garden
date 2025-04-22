import { useQuery } from "@tanstack/react-query";
import { Actuator, ActuatorAction, ActuatorState } from "../models/actuator";
import { useState } from "react";
import { API_URL } from "../environment";

export type ActuatorValue = {
  actuator: Actuator;
  state: ActuatorState;
  startAction: (action: ActuatorAction) => void;
};

export default function useActuator(actuatorId: string): ActuatorValue {
  const [state, setState] = useState<ActuatorState>(ActuatorState.Stopped);

  const { data: actuator } = useQuery<Actuator>({
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
    state,
    startAction: (action: ActuatorAction) => {
      // Just a mock implementation
      if (action.key === "pump.start") {
        setState(ActuatorState.Running);
      } else if (action.key === "pump.stop") {
        setState(ActuatorState.Stopped);
      }
    },
  };
}
