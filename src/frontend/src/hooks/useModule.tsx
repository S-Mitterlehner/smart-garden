import { notifications } from "@mantine/notifications";
import * as signalR from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ConnectionState,
  ModuleActionDto,
  ModuleDto,
  ModuleStateDto,
  ModuleType,
  StateType,
  useExecuteActionMutation,
  useGetModuleByIdQuery,
  useListenStateChangeSubscription,
  useUpdateModuleMutation,
} from "../__generated__/graphql";
import { createCustomApolloClient } from "../utils";
import { SocketType, useAppSettingsContext } from "./useAppSettings";

export type ModuleValue = {
  module: ModuleDto;
  state: ModuleStateDto | null;
  connectionState: ConnectionState;
  actions: ModuleActionDto[];
  canDoAction: boolean;
  startAction: (action: ModuleActionDto, value?: number) => Promise<void>;
  updateRef: (id: string, changes: ModuleDto) => Promise<void>;
};

const ModuleContext = createContext<ModuleValue | null>(null);

export function ModuleProvider({ moduleId, children }: { moduleId: string; children: React.ReactNode }) {
  const module = useModule(moduleId);

  return <ModuleContext.Provider value={module}>{children}</ModuleContext.Provider>;
}

export function useModuleContext(): ModuleValue {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModule must be used within a ModuleProvider");
  }
  return context;
}

const client = createCustomApolloClient("localhost:5206"); //TODO: seek better solution for that

export function useModule(moduleId: string): ModuleValue {
  const { socketType } = useAppSettingsContext();
  const [currentState, setCurrentState] = useState<ModuleStateDto | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.NotConnected);
  const [loading, setLoading] = useState(false);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);
  const {
    data: { module } = {},
    refetch,
    loading: moduleLoading,
  } = useGetModuleByIdQuery({
    variables: { id: moduleId },
  });

  const [execute] = useExecuteActionMutation();
  const [update] = useUpdateModuleMutation();

  const { data: { onModuleStateChanged: state } = {} } = useListenStateChangeSubscription({
    client,
    variables: {
      key: module?.key ?? "",
      type: module?.type ?? ModuleType.Temperature,
    },
    skip: !module || socketType.get !== SocketType.GraphQLSubs,
  });

  useEffect(() => {
    setCurrentState(state!);
    setConnectionState(ConnectionState.Connected);
  }, [state]);

  useEffect(() => {
    let connection: signalR.HubConnection | null = null;
    if (socketType.get !== SocketType.SignalR || module?.key === null || module?.type === null) {
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

    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}/beds/sockets/module`)
      .configureLogging(signalR.LogLevel.Error)
      .withAutomaticReconnect()
      .build();

    connection.onclose(() => setConnectionState(ConnectionState.NotConnected));
    connection.onreconnecting(() => setConnectionState(ConnectionState.NotConnected));
    connection.onreconnected(() => setConnectionState(ConnectionState.Connected));

    connection.on("Module_State", (key: string, type: ModuleType, data: ModuleStateDto) => {
      data.lastUpdate = new Date(data.lastUpdate);
      setCurrentState(data);
    });

    connection
      .start()
      .then(() => {
        connection
          ?.invoke("SubscribeToModule", module!.key, module!.type)
          .then(() => {
            console.log(`module ${module?.key}/${module?.type} subscribed`);
          })
          .catch((er) => {
            console.error(er);
          });

        setConnectionState(ConnectionState.Connected);
      })
      .catch(() => {
        setConnectionState(ConnectionState.NotConnected);
      });

    return () => {
      connection.stop();
      setConnectionState(ConnectionState.NotConnected);
    };
  }, [module?.key, module?.type, socketType, module]);

  useEffect(() => {
    if (module?.state !== undefined) {
      setCurrentState({
        moduleKey: module.key ?? "-",
        connectionState: ConnectionState.NotConnected,
        value: module.state.value,
        min: module.state.min,
        max: module.state.max,
        unit: module.state.unit,
        lastUpdate: new Date(),
        actions: module.state.actions,
        stateType: module.state.stateType,
        state: module.state.state,
        moduleType: module.type,
      });
    }
  }, [module]);

  useEffect(() => {
    if (!currentState) return;

    if (resetTimer) {
      clearTimeout(resetTimer);
    }

    const timer = setTimeout(
      () => {
        setCurrentState((prev) => ({
          connectionState: ConnectionState.NotConnected,
          actions: prev?.actions ?? [],
          moduleKey: prev?.moduleKey ?? "-",
          moduleType: prev?.moduleType ?? ModuleType.Pump,
          lastUpdate: prev?.lastUpdate ?? null,
          stateType: prev?.stateType ?? StateType.Continuous,
          max: prev?.max ?? null,
          min: prev?.min ?? null,
          state: prev?.state ?? null,
          unit: prev?.unit ?? null,
          value: prev?.value ?? null,
        }));
      },
      20 * 1000,
      // 2 * 60 * 1000,
    ); // 2 minutes

    setResetTimer(timer);

    return () => {
      clearTimeout(timer);
    };
  }, [currentState]);

  return {
    module: module ?? ({} as ModuleDto),
    state: currentState ?? module?.state ?? null,
    actions: currentState?.actions ?? [],
    connectionState,
    canDoAction: !moduleLoading && connectionState === ConnectionState.Connected && !loading,
    startAction: async (action: ModuleActionDto, value?: number) => {
      setLoading(true);

      const r = await execute({
        variables: {
          id: moduleId,
          actionKey: action.key,
          value,
        },
      });

      setLoading(false);
      if (r.data?.executeModuleAction.boolean) {
        notifications.show({
          message: `Action "${action.name}" executed successfully.`,
          color: "green",
        });
      }
    },
    updateRef: async (id: string, changes: ModuleDto) => {
      const r = await update({
        variables: {
          ...changes,
          id,
        },
      });

      if ((r.errors?.length ?? 0) > 0) {
        notifications.show({
          title: "Error",
          message: `Failed to update module ${changes.name}`,
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Module updated",
        message: `Module ${changes.name} updated`,
        color: "oklch(69.6% 0.17 162.48)",
      });

      await refetch();
    },
  };
}
