export enum ControllerState {
  NOT_CONNECTED = "NOT_CONNECTED",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  RUNNING = "RUNNING",
  STOPPED = "STOPPED",
}

export enum ActionIcon {
  play = "play",
  stop = "stop",
}

export type ControllerAction = {
  key: string;
  name: string;
  description: string;
  icon: ActionIcon;
  isAllowed: boolean;
};

export type ControllerRef = {
  id: string;
};

export type Controller = ControllerRef & {
  name: string;
  description: string;
  actions: ControllerAction[];
};
