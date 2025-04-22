export enum ActuatorState {
  NotConnected = "NOT_CONNECTED",
  Open = "OPEN",
  Closed = "CLOSED",
  Running = "RUNNING",
  Stopped = "STOPPED",
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
  actions: ActuatorAction[];
};

export type ActuatorAction = {
  key: string;
  name: string;
  description: string;
  icon: ActionIcon;
  isAllowed: boolean;
};
