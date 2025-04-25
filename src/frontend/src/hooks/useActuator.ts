import { useQuery } from "@tanstack/react-query";
import {
  Actuator,
  ActuatorAction,
  ActuatorState,
  ActuatorType,
} from "../models/actuator";
import { API_URL } from "../environment";
import { ConnectionState } from "../models/general";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { notifications } from "@mantine/notifications";

export type ActuatorValue = {
  actuator: Actuator;
  state: ActuatorState;
  connectionState: ConnectionState;
  actions: ActuatorAction[];
  canDoAction: boolean;
  startAction: (action: ActuatorAction, value?: number) => void;
};

export default function useActuator(actuatorId: string): ActuatorValue {
  const [currentState, setCurrentState] = useState<ActuatorState | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.NotConnected
  );
  const [loading, setLoading] = useState(false);
  const {
    data: actuator,
    refetch,
    isFetched,
  } = useQuery<Actuator | null>({
    queryKey: ["actuator", actuatorId],
    enabled: !!actuatorId,
    refetchOnMount: "always",
    initialData: null,
    queryFn: async () => {
      const response = await fetch(`${API_URL}/actuators/${actuatorId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });

  useEffect(() => {
    if (actuator?.key === null || actuator?.type === null) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/sockets/actuator`)
      .withAutomaticReconnect()
      .build();

    connection.onclose(() => setConnectionState(ConnectionState.NotConnected));
    connection.onreconnecting(() =>
      setConnectionState(ConnectionState.NotConnected)
    );
    connection.onreconnected(() =>
      setConnectionState(ConnectionState.Connected)
    );

    connection.on(
      "Actuator_State",
      (key: string, type: ActuatorType, data: ActuatorState) => {
        if (key === actuator?.key && type === actuator.type) {
          data.lastUpdate = new Date(data.lastUpdate);
          setCurrentState(data);
        }
      }
    );

    connection
      .start()
      .then(() => {
        console.log(`actuator ${actuator?.key}/${actuator?.type} ws connected`);
        setConnectionState(ConnectionState.Connected);
      })
      .catch(() => {
        setConnectionState(ConnectionState.NotConnected);
      });

    return () => {
      connection.stop();
      console.log(`actuator ${actuator?.key}/${actuator?.type} ws stopped`);
      setConnectionState(ConnectionState.NotConnected);
    };
  }, [actuator?.key, actuator?.type]);

  useEffect(() => {
    if (actuator?.state !== undefined) {
      setCurrentState({
        actuatorKey: actuator.key ?? "-",
        connectionState: ConnectionState.NotConnected,
        value: actuator.state.value,
        min: actuator.state.min,
        max: actuator.state.min,
        unit: actuator.state.unit,
        lastUpdate: new Date(),
        actions: actuator.actions,
        stateType: actuator.state.stateType,
        state: actuator.state.state,
        actuatorType: actuator.type,
      });
    }
  }, [actuator]);

  return {
    actuator: actuator ?? ({} as Actuator),
    state: currentState ?? ({} as ActuatorState),
    actions: currentState?.actions ?? [],
    connectionState,
    canDoAction:
      isFetched && connectionState === ConnectionState.Connected && !loading,
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
        notifications.show({
          message: `Action "${action.name}" requested. This may take a few seconds.`,
          color: "green",
        });
        refetch();
        setLoading(false);
      }
    },
  };
}
