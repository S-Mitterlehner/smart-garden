import { createContext, useContext, useState } from "react";

export enum SocketType {
  SignalR = "SignalR",
  GraphQLSubs = "GraphQLSubs",
}

export type Property<T> = {
  get: T;
  set: (value: T) => void;
};

export type AppSettings = {
  socketType: Property<SocketType>;
};

const AppSettingsContext = createContext<AppSettings | null>(null);

export function AppSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const appSettings = useAppSettings();

  return (
    <AppSettingsContext.Provider value={appSettings}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettingsContext(): AppSettings {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within a AppSettingsProvider");
  }
  return context;
}

export function useAppSettings(): AppSettings {
  const ls = localStorage.getItem("socketType");
  const initialSocketType = ls ? (ls as SocketType) : SocketType.GraphQLSubs;

  const [socketType, setSocketType] = useState<SocketType>(initialSocketType);

  return {
    socketType: {
      get: socketType,
      set: (value: SocketType) => {
        setSocketType(value);
        localStorage.setItem("socketType", value);
      },
    },
  };
}
