import { notifications } from "@mantine/notifications";
import * as signalR from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ActuatorActionDto,
  ActuatorDto,
  ActuatorStateDto,
  useExecuteActionMutation,
  useGetActuatorByIdQuery,
  useListenStateChangeSubscription,
  useUpdateActuatorMutation,
} from "../__generated__/graphql";
import { API_URL } from "../environment";
import { ActuatorState, ActuatorType } from "../models/actuator";
import { ConnectionState } from "../models/general";
import { SocketType, useAppSettingsContext } from "./useAppSettings";

export type ActuatorValue = {
  actuator: ActuatorDto;
  state: ActuatorStateDto | null;
  connectionState: ConnectionState;
  actions: ActuatorActionDto[];
  canDoAction: boolean;
  startAction: (action: ActuatorActionDto, value?: number) => Promise<void>;
  updateRef: (id: string, changes: ActuatorDto) => Promise<void>;
};

const ActuatorContext = createContext<ActuatorValue | null>(null);

export function ActuatorProvider({
  actuatorId,
  children,
}: {
  actuatorId: string;
  children: React.ReactNode;
}) {
  const actuator = useActuator(actuatorId);

  return (
    <ActuatorContext.Provider value={actuator}>
      {children}
    </ActuatorContext.Provider>
  );
}

export function useActuatorContext(): ActuatorValue {
  const context = useContext(ActuatorContext);
  if (!context) {
    throw new Error("useActuator must be used within a ActuatorProvider");
  }
  return context;
}

export function useActuator(actuatorId: string): ActuatorValue {
  const { socketType } = useAppSettingsContext();
  const [currentState, setCurrentState] = useState<ActuatorStateDto | null>(
    null,
  );
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.NotConnected,
  );
  const [loading, setLoading] = useState(false);
  const {
    data: { actuator } = {},
    refetch,
    loading: actuatorLoading,
  } = useGetActuatorByIdQuery({
    variables: { id: actuatorId },
  });

  const [execute] = useExecuteActionMutation();
  const [update] = useUpdateActuatorMutation();

  const { data: { onActuatorStateChanged: state } = {} } =
    useListenStateChangeSubscription({
      variables: {
        key: actuator?.key ?? "",
        type: actuator?.type ?? "",
      },
      skip: !actuator || socketType.get !== SocketType.GraphQLSubs,
    });

  useEffect(() => {
    setCurrentState(state!);
    setConnectionState(ConnectionState.Connected);
  }, [state]);

  useEffect(() => {
    let connection: signalR.HubConnection | null = null;
    if (
      socketType.get !== SocketType.SignalR ||
      actuator?.key === null ||
      actuator?.type === null
    ) {
      // console.log(`${actuator?.key}/${actuator?.type} GraphQL is used`);

      try {
        if (connection) {
          (connection as signalR.HubConnection).stop();
        }
      } catch {
        // just ignore it
      }

      setConnectionState(ConnectionState.NotConnected);
      return;
    }
    // console.log(`${actuator?.key}/${actuator?.type} SignalR is used`);

    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/sockets/actuator`)
      .configureLogging(signalR.LogLevel.Error)
      .withAutomaticReconnect()
      .build();

    connection.onclose(() => setConnectionState(ConnectionState.NotConnected));
    connection.onreconnecting(() =>
      setConnectionState(ConnectionState.NotConnected),
    );
    connection.onreconnected(() =>
      setConnectionState(ConnectionState.Connected),
    );

    connection.on(
      "Actuator_State",
      (key: string, type: ActuatorType, data: ActuatorState) => {
        data.lastUpdate = new Date(data.lastUpdate);
        setCurrentState(data);
      },
    );

    connection
      .start()
      .then(() => {
        connection
          ?.invoke("SubscribeToActuator", actuator!.key, actuator!.type)
          .then(() => {
            console.log(
              `actuator ${actuator?.key}/${actuator?.type} subscribed`,
            );
          })
          .catch((er) => {
            console.error(er);
          });

        // console.log(`actuator ${actuator?.key}/${actuator?.type} ws connected`);
        setConnectionState(ConnectionState.Connected);
      })
      .catch(() => {
        setConnectionState(ConnectionState.NotConnected);
      });

    return () => {
      connection.stop();
      // console.log(`actuator ${actuator?.key}/${actuator?.type} ws stopped`);
      setConnectionState(ConnectionState.NotConnected);
    };
  }, [actuator?.key, actuator?.type, socketType, actuator]);

  useEffect(() => {
    if (actuator?.state !== undefined) {
      setCurrentState({
        actuatorKey: actuator.key ?? "-",
        connectionState: ConnectionState.NotConnected,
        value: actuator.state.value,
        min: actuator.state.min,
        max: actuator.state.max,
        unit: actuator.state.unit,
        lastUpdate: new Date(),
        actions: actuator.state.actions,
        stateType: actuator.state.stateType,
        state: actuator.state.state,
        actuatorType: actuator.type,
      });
    }
  }, [actuator]);

  return {
    actuator: actuator ?? ({} as ActuatorDto),
    state: currentState ?? actuator?.state ?? null,
    actions: currentState?.actions ?? [],
    connectionState,
    canDoAction:
      !actuatorLoading &&
      connectionState === ConnectionState.Connected &&
      !loading,
    startAction: async (action: ActuatorActionDto, value?: number) => {
      setLoading(true);

      const r = await execute({
        variables: {
          id: actuatorId,
          actionKey: action.key,
          value,
        },
      });

      setLoading(false);
      if (r.data?.executeActuatorAction.boolean) {
        notifications.show({
          message: `Action "${action.name}" executed successfully.`,
          color: "green",
        });
      }
    },
    updateRef: async (id: string, changes: ActuatorDto) => {
      const r = await update({
        variables: {
          ...changes,
          id,
        },
      });

      if ((r.errors?.length ?? 0) > 0) {
        notifications.show({
          title: "Error",
          message: `Failed to update actuator ${changes.name}`,
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Actuator updated",
        message: `Actuator ${changes.name} updated`,
        color: "oklch(69.6% 0.17 162.48)",
      });

      await refetch();
    },
  };
}
