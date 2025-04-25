import { useQuery } from "@tanstack/react-query";
import { Sensor, SensorData, SensorType } from "../models/sensor";
import { API_URL } from "../environment";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ConnectionState } from "../models/general";

export type SensorValue = {
  isFetched: boolean;
  sensor: Sensor;
  currentState: SensorData;
  connectionState: ConnectionState;
};

export default function useSensor(sensorId: string): SensorValue {
  const [currentState, setCurrentState] = useState<SensorData | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.NotConnected
  );
  const { data: sensor, isFetched } = useQuery<Sensor | null>({
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

  useEffect(() => {
    if (sensor?.key === null || sensor?.type === null) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/sockets/sensor`)
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
        console.log(`sensor ${sensor?.key}/${sensor?.type} ws connected`);
        setConnectionState(ConnectionState.Connected);
      })
      .catch(() => {
        setConnectionState(ConnectionState.NotConnected);
      });

    return () => {
      connection.stop();
      console.log(`sensor ${sensor?.key}/${sensor?.type} ws stopped`);
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
    currentState: currentState ?? ({} as SensorData),
    connectionState,
  };
}
