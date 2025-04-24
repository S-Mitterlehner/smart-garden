import { ConnectionState } from "./general";

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
};

export type Actuator = ActuatorRef & {
  description: string;
  state: ActuatorState;
  actions: ActuatorAction[];
};

export type ActuatorState = {
  connectionState: ConnectionState;
  type: StateType;
  state: string;
  value: number;
  min: number;
  max: number;
  unit: string;
};

export type ActuatorAction = {
  type: ActionType;
  key: string;
  name: string;
  description: string;
  isAllowed: boolean;
  icon: ActionIcon;
  currentValue?: number;
  min?: number;
  max?: number;
};
