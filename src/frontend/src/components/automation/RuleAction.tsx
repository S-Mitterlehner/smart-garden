import { ActionIcon, Slider, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { AutomationRuleActionDto, ModuleDto } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";
import { getActionIcon, getTypeIconCircle } from "../modules/utils";

export function RuleAction({ action, module }: { action: AutomationRuleActionDto; module: ModuleDto | undefined }) {
  const [sliderValue, setSliderValue] = useState(50);
  const { deleteRuleAction: deleteRuleAction } = useAutomationContext();

  function setSliderEndValue(value: number): void {
    console.log("SliderValue: ", value);
  }

  if (!module) {
    return <div className="text-gray-500 italic">Cannot show actions failed to load modules ...</div>;
  }

  const actionData = module.state.actions.find((a) => a.key == action.actionKey);
  const showSlider: boolean = actionData?.min != null && actionData?.max != null;
  return (
    <div className="flex w-full items-center gap-6 border-b py-2 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center">
          <span className="me-2">{getTypeIconCircle(module.type)}</span>
          <p className="font-medium">{module.name}</p>
        </div>
        <p className="text-xs text-gray-500">{module.description}</p>
        <p className="text-xs text-gray-500">{module.key}</p>
      </div>

      <div className="flex w-[300px] flex-col">
        <div className="mb-1 flex items-center">
          <span className="me-2">{getActionIcon(actionData?.icon!)}</span>
          <p className="text-sm text-gray-800">
            {actionData?.name || "Value:"} {showSlider ? sliderValue : null} {actionData?.unit}
          </p>
        </div>

        {showSlider && (
          <Slider
            min={actionData?.min || 0}
            max={actionData?.max || 100}
            value={sliderValue}
            onChange={setSliderValue}
            onChangeEnd={setSliderEndValue}
            className="mt-1"
          />
        )}
      </div>

      <div className="ms-auto">
        <Tooltip label="Delete" withArrow position="top">
          <ActionIcon variant="transparent" color="red" size="sm" onClick={() => deleteRuleAction(action)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
}
