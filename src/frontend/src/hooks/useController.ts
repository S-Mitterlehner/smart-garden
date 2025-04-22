import { useQuery } from "@tanstack/react-query";
import {
  Controller,
  ControllerAction,
  ControllerState,
} from "../models/controller";
import { useState } from "react";
import { API_URL } from "../environment";

export type ControllerValue = {
  controller: Controller;
  state: ControllerState;
  startAction: (action: ControllerAction) => void;
};

export default function useController(controllerId: string): ControllerValue {
  const [state, setState] = useState<ControllerState>(ControllerState.STOPPED);

  const { data: controller } = useQuery<Controller>({
    queryKey: ["controller", controllerId],
    enabled: !!controllerId,
    refetchOnMount: "always",
    queryFn: async () => {
      const response = await fetch(`${API_URL}/controllers/${controllerId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return {
    controller: controller ?? ({} as Controller),
    state,
    startAction: (action: ControllerAction) => {
      // Just a mock implementation
      if (action.id === "pump.start") {
        setState(ControllerState.RUNNING);
      } else if (action.id === "pump.stop") {
        setState(ControllerState.STOPPED);
      }
    },
  };
}
