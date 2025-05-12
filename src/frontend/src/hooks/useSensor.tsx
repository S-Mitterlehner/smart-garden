import { useQuery } from "@tanstack/react-query";
// import { useQuery } from "@apollo/client";
import { Sensor, SensorData, SensorRef, SensorType } from "../models/sensor";
import { API_URL } from "../environment";
import { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ConnectionState } from "../models/general";
import { notifications } from "@mantine/notifications";
// import { gql } from "../__generated__";
// import { SENSOR_BY_ID_QUERY } from "../queries/sensor-query";

export type SensorValue = {
  isFetched: boolean;
  sensor: Sensor;
  currentState: SensorData | null;
  connectionState: ConnectionState;
  updateRef: (id: string, changes: Sensor) => Promise<void>;
};

const SensorContext = createContext<SensorValue | null>(null);

export function SensorProvider({
  sensorId,
  children,
}: {
  sensorId: string;
  children: React.ReactNode;
}) {
  const sensor = useSensor(sensorId);

  return (
    <SensorContext.Provider value={sensor}>{children}</SensorContext.Provider>
  );
}

export function useSensorContext(): SensorValue {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error("useSensor must be used within a SensorProvider");
  }
  return context;
}

// const GET_SENSOR_QUERY_KEY = gql(/* GraphQL */ `
//   query {
//     sensors {
//       id
//       name
//       currentValue
//       maxValue
//       minValue
//       unit
//     }
//   }
// `);

export function useSensor(sensorId: string): SensorValue {
  const [currentState, setCurrentState] = useState<SensorData | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.NotConnected
  );
  const {
    data: sensor,
    isFetched,
    refetch,
  } = useQuery<Sensor | null>({
    queryKey: ["sensor", sensorId],
    enabled: !!sensorId,
    refetchOnMount: "always",
    initialData: null,
    queryFn: async () => {
      const response = await fetch(`${API_URL}/sensors/${sensorId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // const { data: sensors, refetch } = useQuery<SensorRef>(
  //   SENSOR_BY_ID_QUERY,
  //   {}
  // );

  useEffect(() => {
    if (sensor?.key === null || sensor?.type === null) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/sockets/sensor`)
      .configureLogging(signalR.LogLevel.Error)
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
      "Sensor_Measurement",
      (key: string, type: SensorType, data: SensorData) => {
        if (key === sensor?.key && type === sensor.type) {
          data.lastUpdate = new Date(data.lastUpdate);
          setCurrentState(data);
        }
      }
    );

    connection
      .start()
      .then(() => {
        // console.log(`sensor ${sensor?.key}/${sensor?.type} ws connected`);
        setConnectionState(ConnectionState.Connected);
      })
      .catch(() => {
        setConnectionState(ConnectionState.NotConnected);
      });

    return () => {
      connection.stop();
      // console.log(`sensor ${sensor?.key}/${sensor?.type} ws stopped`);
      setConnectionState(ConnectionState.NotConnected);
    };
  }, [sensor?.key, sensor?.type]);

  // Sync initial data
  useEffect(() => {
    if (sensor?.currentValue !== undefined) {
      setCurrentState({
        sensorKey: sensor.key ?? "-",
        connectionState: ConnectionState.NotConnected,
        currentValue: sensor.currentValue,
        min: sensor.minValue,
        max: sensor.maxValue,
        unit: sensor.unit,
        lastUpdate: new Date(),
      });
    }
  }, [sensor]);

  return {
    isFetched,
    sensor: sensor ?? ({} as Sensor),
    currentState: currentState ?? null,
    connectionState,
    updateRef: async (id: string, changes: Sensor) => {
      const resp = await fetch(`${API_URL}/sensors/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      if (resp.status === 200) {
        notifications.show({
          title: "Sensor updated",
          message: `Sensor ${changes.name} updated`,
          color: "oklch(69.6% 0.17 162.48)",
        });
      } else {
        notifications.show({
          title: "Error",
          message: `Failed to update sensor ${changes.name}`,
          color: "red",
        });
      }

      await refetch();
    },
  };
}
