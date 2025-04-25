import { Menu } from "@mantine/core";
import useActuator from "../../hooks/useActuator";
import { ActionIcon, ActuatorRef } from "../../models/actuator";
import Card from "../Card";
import ActuatorStateIndicator from "./ActuatorStateIndicator";
import {
  IconListDetails,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
} from "@tabler/icons-react";

export default function ActuatorCard({
  actuator: actuatorRef,
  onMenuAction = () => {},
}: {
  actuator: ActuatorRef;
  onMenuAction?: (
    actuator: ActuatorRef,
    action: string,
    actionData?: unknown
  ) => void;
}) {
  const {
    actuator,
    state,
    connectionState,
    actions,
    canDoAction,
    startAction,
  } = useActuator(actuatorRef.id);

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

  return (
    <Menu shadow="md">
      <Menu.Target>
        <button className="text-left cursor-pointer w-full phone:w-auto">
          <Card title={actuator.name}>
            <div className="flex flex-col items-center gap-4">
              <ActuatorStateIndicator
                state={state}
                connectionState={connectionState}
              />
              {/* <ActuatorActions
                disabled={!canDoAction}
                actions={actuator.actions}
                isConnected={
                  state.connectionState === ConnectionState.Connected
                }
                onActionClick={startAction}
              /> */}
            </div>
          </Card>
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        {actions.map((action) => {
          return (
            <Menu.Item
              key={action.key}
              onClick={() => startAction(action)}
              disabled={!canDoAction || !action.isAllowed}
              leftSection={getIcon(action.icon)}
            >
              {action.name}
            </Menu.Item>
          );
        })}
        <Menu.Label>Bed Actions</Menu.Label>
        <Menu.Item
          onClick={() => onMenuAction(actuatorRef, "details")}
          leftSection={<IconListDetails className="w-4 h-4" />}
        >
          View Actuator Details
        </Menu.Item>
        <Menu.Item
          onClick={() => onMenuAction(actuatorRef, "remove")}
          color="red"
          leftSection={<IconTrash className="w-4 h-4" />}
        >
          Remove Actuator from Bed
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
