import { ConnectionState } from "./general";

export enum ActuatorType {
  Pump = "Pump",
}

export enum ActuatorStateStrings {
  Open = "Open",
  Closed = "Closed",
  Running = "Running",
  Stopped = "Stopped",
}

export enum ActionType {
  Command = "Command",
  Value = "Value",
}

export enum StateType {
  Discrete = "Discrete",
  Continuous = "Continuous",
}

export enum ActionIcon {
  play = "play",
  stop = "stop",
}

export type ActuatorRef = {
  id: string;
  name: string;
  description: string;
  key: string;
  type: string;
};

export type Actuator = ActuatorRef & {
  state: ActuatorState;
  actions: ActuatorAction[];
};

export type ActuatorState = {
  actuatorKey: string;
  actuatorType: string;
  connectionState: ConnectionState;
  stateType: StateType;
  state?: string;
  value?: number;
  min?: number;
  max?: number;
  unit?: string;
  actions: ActuatorAction[];
  lastUpdate: Date;
};

export type ActuatorAction = {
  key: string;
  name: string;
  description: string;
  type: ActionType;
  isAllowed: boolean;
  icon: ActionIcon;
  currentValue?: number;
  min?: number;
  max?: number;
};
