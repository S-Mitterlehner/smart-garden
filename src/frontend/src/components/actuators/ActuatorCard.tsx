import { Button, Drawer, Menu, Modal, Slider, Tooltip } from "@mantine/core";
import { IconListDetails, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { ActionType, ConnectionState, ModuleActionDto, ModuleRefDto } from "../../__generated__/graphql";
import { useModuleContext } from "../../hooks/useModule";
import { getTimeString } from "../../utils";
import Card from "../Card";
import { getActionIcon, getTypeIconCircle } from "../sensors/utils";
import ActuatorProperties from "./ActuatorProperties";
import ActuatorStateIndicator from "./ActuatorStateIndicator";

export default function ActuatorCard({
  onMenuAction = () => {},
}: {
  onMenuAction?: (actuator: ModuleRefDto, action: string, actionData?: unknown) => void;
}) {
  const { module: actuator, state, connectionState, actions, canDoAction, startAction } = useModuleContext();

  const [showPropertiesDrawer, setShowPropertiesDrawer] = useState(false);
  const [showValueModal, setShowValueModal] = useState(false);
  const [sliderValue, setSliderValue] = useState<number | undefined>(undefined);
  const [currentAction, setCurrentAction] = useState<ModuleActionDto | null>(null);

  const executeAction = (action: ModuleActionDto, value: number | undefined) => {
    if (!action.isAllowed) return;

    setCurrentAction(action);

    if (action.type === ActionType.Value && value === undefined) {
      setShowValueModal(true);
      setSliderValue(currentAction?.currentValue ?? currentAction?.min ?? 1);
      return;
    }

    setShowValueModal(false);
    setCurrentAction(null);
    startAction(action, value);
  };

  const getCardIcon = () => {
    let tooltip = actuator.type?.toString() ?? "";
    let variants = {};

    if (state?.connectionState === ConnectionState.NotConnected) {
      tooltip += " (Statusupdate overdue)";
      variants = { color: "orange" };
    }

    return (
      <Tooltip label={tooltip} position="top" withArrow>
        {getTypeIconCircle(actuator.type, variants)}
      </Tooltip>
    );
  };

  return (
    <>
      <Drawer
        opened={showPropertiesDrawer}
        onClose={() => setShowPropertiesDrawer(false)}
        offset={15}
        radius={10}
        position="right"
      >
        <ActuatorProperties />
      </Drawer>
      <Modal
        opened={showValueModal}
        onClose={() => {
          setShowValueModal(false);
          setSliderValue(undefined);
          setCurrentAction(null);
        }}
      >
        <p>Please select the value for the action</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Slider
            className="w-full"
            min={currentAction?.min ?? 0}
            max={currentAction?.max ?? 100}
            step={currentAction?.increment ?? 1}
            value={sliderValue}
            onChange={setSliderValue}
          ></Slider>
          <span className="w-24 text-right text-sm text-gray-500">{`${sliderValue} ${currentAction?.unit ?? ""}`}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button color="gray" onClick={() => setShowValueModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => executeAction(currentAction!, sliderValue)}>Execute</Button>
        </div>
      </Modal>
      <Menu shadow="md">
        <Menu.Target>
          <button className="w-full cursor-pointer text-left phone:w-auto">
            <Card
              className="hover:bg-gray-50!"
              title={actuator.name}
              icon={getCardIcon()}
              right={
                <div className="flex flex-col text-right text-xs">
                  <span className="text-gray-400">Last Update: </span>
                  <span>{getTimeString(state?.lastUpdate)}</span>
                </div>
              }
            >
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <ActuatorStateIndicator state={state} connectionState={connectionState} />
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
                leftSection={getActionIcon(action.icon)}
              >
                {action.name}
              </Menu.Item>
            );
          })}
          <Menu.Label>Misc</Menu.Label>
          <Menu.Item
            onClick={() => setShowPropertiesDrawer(true)}
            leftSection={<IconListDetails className="h-4 w-4" />}
          >
            View Actuator Details
          </Menu.Item>
          <Menu.Item
            onClick={() => onMenuAction(actuator as ModuleRefDto, "remove")}
            color="red"
            leftSection={<IconTrash className="h-4 w-4" />}
          >
            Remove Actuator from Bed
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
