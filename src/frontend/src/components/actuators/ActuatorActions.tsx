import { Group, Slider, Tooltip } from "@mantine/core";
import { ActionIcon, ActionType, ActuatorAction } from "../../models/actuator";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { useState } from "react";

export type ActuatorActionsProps = {
  isConnected: boolean;
  actions: ActuatorAction[];
  disabled?: boolean;
  onActionClick: (action: ActuatorAction, value?: number) => void;
};

export type ActuatorActionProps = {
  isConnected: boolean;
  action: ActuatorAction;
  disabled?: boolean;
  onActionClick: (action: ActuatorAction, value?: number) => void;
};

export default function ActuatorActions({
  isConnected,
  actions,
  onActionClick,
  disabled = false,
}: ActuatorActionsProps) {
  const items = actions?.map((a) => {
    switch (a.type) {
      case ActionType.Command:
        return (
          <ActuatorCommand
            key={a.key}
            action={a}
            onActionClick={onActionClick}
            disabled={disabled}
            isConnected={isConnected}
          />
        );
      case ActionType.Value:
        return (
          <ActuatorValue
            key={a.key}
            action={a}
            onActionClick={onActionClick}
            disabled={disabled}
            isConnected={isConnected}
          />
        );
    }
  });

  return (
    <div className="flex flex-row gap-2 items-center justify-center min-h-8">
      {items}
    </div>
  );
}

export function ActuatorCommand({
  action,
  onActionClick,
  disabled,
  isConnected,
}: ActuatorActionProps) {
  return (
    <Tooltip label={action.description}>
      <button
        className="bg-gray-200 hover:bg-gray-300 disabled:hover:bg-gray-200 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        onClick={() => onActionClick(action)}
        disabled={disabled || !isConnected || !action.isAllowed}
      >
        {getIcon(action.icon)}
      </button>
    </Tooltip>
  );
}

export function ActuatorValue({
  action,
  onActionClick,
  disabled,
  isConnected,
}: ActuatorActionProps) {
  const [value, setValue] = useState(action.currentValue ?? 0);
  return (
    <Group className="flex flex-row items-center justify-center">
      <div className="flex flex-col justify-center">
        <p className="text-xs">{action.name}</p>
        <Slider
          className="w-36"
          value={value}
          min={action.min}
          max={action.max}
          disabled={!isConnected || disabled}
          onChange={setValue}
        ></Slider>
      </div>
      <Tooltip label={action.description}>
        <button
          className="bg-gray-200 hover:bg-gray-300 disabled:hover:bg-gray-200 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={() => onActionClick(action, value)}
          disabled={disabled || !isConnected || !action.isAllowed}
        >
          {getIcon(action.icon)}
        </button>
      </Tooltip>
    </Group>
  );
}

const getIcon = (icon: ActionIcon) => {
  switch (icon) {
    case ActionIcon.play:
      return <IconPlayerPlay className="w-4 h-4 text-emerald-600" />;
    case ActionIcon.stop:
      return <IconPlayerStop className="w-4 h-4 text-red-700" />;
    default:
      return <IconPlayerPlay className="w-4 h-4" />;
  }
};
