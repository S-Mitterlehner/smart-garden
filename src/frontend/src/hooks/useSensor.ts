import { useQuery } from "@tanstack/react-query";
import { Sensor, SensorData } from "../models/sensor";
import { API_URL } from "../environment";
import { useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ConnectionState } from "../models/general";

export type SensorValue = {
  isFetched: boolean;
  sensor: Sensor;
  currentValue: number | null;
  connectionState: ConnectionState;
};

export default function useSensor(sensorId: string): SensorValue {
  const [currentState, setCurrentState] = useState<SensorData | null>();
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

  const connectorKey = useMemo(() => sensor?.key, [sensor]);

  useEffect(() => {
    if (connectorKey === null) return;

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

    connection.on("Sensor_Measurement", (key: string, data: SensorData) => {
      if (key === connectorKey) {
        setCurrentState(data);
      }
    });

    connection
      .start()
      .then(() => {
        console.log("started");
        setConnectionState(ConnectionState.Connected);
      })
      .catch(() => {
        setConnectionState(ConnectionState.NotConnected);
      });

    return () => {
      console.log("stop");
      connection.stop();
      setConnectionState(ConnectionState.NotConnected);
    };
  }, [connectorKey]);

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
      });
    }
  }, [sensor]);

  return {
    isFetched,
    sensor: sensor ?? ({} as Sensor),
    currentValue: currentState?.currentValue ?? 0,
    connectionState,
  };
}
