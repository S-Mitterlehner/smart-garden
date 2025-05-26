import { Button, Drawer, Menu, Modal, Slider, Tooltip } from "@mantine/core";
import { IconListDetails, IconPlayerPlay, IconPlayerStop, IconStopwatch, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import {
  ActionIcons,
  ActionType,
  ConnectionState,
  ModuleActionDto,
  ModuleRefDto,
  PlantModuleConfigDto,
} from "../../__generated__/graphql";
import { useModuleContext } from "../../hooks/useModule";
import { getTimeString } from "../../utils";
import Card from "../Card";
import { getTypeIconCircle } from "../sensors/utils";
import ModuleProperties from "./ModuleProperties";
import ModuleStateIndicator from "./ModuleStateIndicator";

export default function ModuleCard({
  plantConfig,
  onMenuAction = () => {},
}: {
  plantConfig?: PlantModuleConfigDto;
  onMenuAction?: (module: ModuleRefDto, action: string, actionData?: unknown) => void;
}) {
  const { module: module, state, connectionState, actions, canDoAction, startAction } = useModuleContext();

  const [showPropertiesDrawer, setShowPropertiesDrawer] = useState(false);
  const [showValueModal, setShowValueModal] = useState(false);
  const [sliderValue, setSliderValue] = useState<number | undefined>(undefined);
  const [currentAction, setCurrentAction] = useState<ModuleActionDto | null>(null);

  const getIcon = (icon: ActionIcons) => {
    switch (icon) {
      case ActionIcons.Play:
        return <IconPlayerPlay className="h-4 w-4 text-emerald-600" />;
      case ActionIcons.Stop:
        return <IconPlayerStop className="h-4 w-4 text-red-700" />;
      case ActionIcons.Timer:
        return <IconStopwatch className="h-4 w-4 text-yellow-500" />;
      default:
        return <IconPlayerPlay className="h-4 w-4" />;
    }
  };

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
    let tooltip = module.type?.toString() ?? "";
    let variants = {};

    if (state?.connectionState === ConnectionState.NotConnected) {
      tooltip += " (Statusupdate overdue)";
      variants = { color: "orange" };
    }

    return (
      <Tooltip label={tooltip} position="top" withArrow>
        {getTypeIconCircle(module.type, variants)}
      </Tooltip>
    );
  };

  const getActions = () => {
    if (module.isSensor) return <></>;

    return (
      <>
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
      </>
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
        <ModuleProperties />
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
              title={module.name}
              icon={getCardIcon()}
              right={
                <div className="flex flex-col text-right text-xs">
                  <span className="text-gray-400">Last Update: </span>
                  <span>{getTimeString(state?.lastUpdate)}</span>
                </div>
              }
            >
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <ModuleStateIndicator state={state} connectionState={connectionState} plantConfig={plantConfig} />
              </div>
            </Card>
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          {getActions()}
          <Menu.Label>Misc</Menu.Label>
          <Menu.Item
            onClick={() => setShowPropertiesDrawer(true)}
            leftSection={<IconListDetails className="h-4 w-4" />}
          >
            View Module Details
          </Menu.Item>
          <Menu.Item
            onClick={() => onMenuAction(module as ModuleRefDto, "remove")}
            color="red"
            leftSection={<IconTrash className="h-4 w-4" />}
          >
            Remove Module from Bed
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
