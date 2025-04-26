import { Button, Menu, Modal, Slider } from "@mantine/core";
import useActuator from "../../hooks/useActuator";
import {
  ActionIcon,
  ActionType,
  ActuatorAction,
  ActuatorRef,
} from "../../models/actuator";
import Card from "../Card";
import ActuatorStateIndicator from "./ActuatorStateIndicator";
import {
  IconListDetails,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

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
  const [showValueModal, setShowValueModal] = useState(false);
  const [sliderValue, setSliderValue] = useState<number | undefined>(undefined);
  const [currentAction, setCurrentAction] = useState<ActuatorAction | null>(
    null
  );
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

  const executeAction = (action: ActuatorAction, value: number | undefined) => {
    if (!action.isAllowed) return;

    setCurrentAction(action);

    if (action.type === ActionType.Value && value === undefined) {
      setShowValueModal(true);
      setSliderValue(state.value ?? state.min);
      return;
    }

    setShowValueModal(false);
    setCurrentAction(null);
    startAction(action, value);
  };

  return (
    <>
      <Modal
        opened={showValueModal}
        onClose={() => {
          setShowValueModal(false);
          setSliderValue(undefined);
          setCurrentAction(null);
        }}
      >
        <p>Please select the value for the action</p>
        <div className="flex justify-between items-center mt-4 gap-2">
          <Slider
            color="oklch(69.6% 0.17 162.48)"
            className="w-full"
            min={state.min}
            max={state.max}
            step={0.01}
            value={sliderValue}
            onChange={setSliderValue}
          ></Slider>
          <span className="text-sm text-gray-500 w-24 text-right">
            {`${sliderValue} ${state.unit}`}
          </span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button color="gray" onClick={() => setShowValueModal(false)}>
            Cancel
          </Button>
          <Button
            color="oklch(69.6% 0.17 162.48)"
            onClick={() => executeAction(currentAction!, sliderValue)}
          >
            Execute
          </Button>
        </div>
      </Modal>
      <Menu shadow="md">
        <Menu.Target>
          <button className="text-left cursor-pointer w-full phone:w-auto">
            <Card title={actuator.name}>
              <div className="flex flex-col items-center gap-4">
                <ActuatorStateIndicator
                  state={state}
                  connectionState={connectionState}
                />
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
                onClick={() => executeAction(action, undefined)}
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
    </>
  );
}
