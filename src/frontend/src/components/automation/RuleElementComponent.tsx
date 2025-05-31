import { ActionIcon, NumberInput, Select, Tooltip } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IconCategoryPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { StateType } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";
import { Rule, RuleConnector, RuleElement, RuleValueRef } from "../../models/automation";

const comparators = [
  { label: "=", value: "==", allowedTypes: ["string", "number", "boolean", "select", "time"] },
  { label: "!=", value: "!=", allowedTypes: ["string", "number", "boolean", "select", "time"] },
  { label: "<", value: "<", allowedTypes: ["number", "time"] },
  { label: "<=", value: "<=", allowedTypes: ["number", "time"] },
  { label: ">", value: ">", allowedTypes: ["number", "time"] },
  { label: ">=", value: ">=", allowedTypes: ["number", "time"] },
];

export default function RuleElementComponent({
  rulePart,
  level = 0,
  updateEditCopy = () => {},
}: {
  rulePart: RuleElement;
  level?: number;
  updateEditCopy?: (rule: Rule | undefined) => void;
}) {
  const { fieldSelection, parameterFields } = useAutomationContext();

  const ruleKey = useMemo(() => Object.keys(rulePart)[0], [rulePart]);
  const ruleValueRef = useMemo<RuleValueRef>(() => rulePart[ruleKey][0] as RuleValueRef, [rulePart, ruleKey]);
  const ruleValue = useMemo(() => rulePart[ruleKey][1], [rulePart, ruleKey]);

  const [numValue, setNumValue] = useState<number>(0);
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [timeValue, setTimeValue] = useState<string>("00:00:00");

  const [selectedValueRef, setSelectedValueRef] = useState<string | null>(null);
  const [selectedComparator, setSelectedComparator] = useState<string | null>(null);

  const configVal = useMemo(
    () => parameterFields?.find((f) => f.key === selectedValueRef),
    [parameterFields, selectedValueRef],
  );

  const allowedComparators = useMemo(() => {
    return comparators.filter((c) => c.allowedTypes.includes(configVal?.tsType || "string"));
  }, [configVal]);

  useEffect(() => {
    setSelectedComparator(ruleKey);
    setSelectedValueRef(ruleValueRef?.var);
    setNumValue(ruleValue as number);
    setSelectValue(ruleValue as string | null);
    setTimeValue(ruleValue as string);
  }, [fieldSelection, ruleValueRef, ruleKey, ruleValue]);

  const update = (changedComparator?: string, changedValueRef?: string, changedValue?: string | number | boolean) => {
    let newValue = ruleValue;

    if (!!changedValue) newValue = changedValue;
    else {
      if (configVal?.valueType === StateType.Discrete) {
        newValue = selectValue!;
      } else if (configVal?.valueType === StateType.Continuous) {
        if (configVal.tsType === "number") {
          newValue = numValue;
        } else if (configVal.tsType === "time") {
          newValue = timeValue;
        } else {
          console.error("Unsupported type for continuous value:", configVal.tsType);
          return;
        }
      } else {
        console.error("Unsupported value type:", configVal?.valueType);
        return;
      }
    }

    const newRule: Rule = {
      [(changedComparator ?? selectedComparator) || ""]: [
        { var: (changedValueRef ?? selectedValueRef) || "" },
        newValue,
      ],
    };

    updateEditCopy(newRule);
  };

  const getInput = () => {
    if (!configVal) {
      return <div>-</div>;
    }

    switch (configVal.valueType) {
      case StateType.Continuous:
        switch (configVal.tsType) {
          case "number":
            return (
              <NumberInput
                min={configVal.min ?? 0}
                max={configVal.max ?? 999999999}
                placeholder="Enter value"
                value={numValue ?? 0}
                onChange={(e) => {
                  setNumValue(e as number);
                  update(undefined, undefined, e as number);
                }}
              />
            );
          case "time":
            return (
              <TimeInput
                withSeconds
                placeholder="Enter time"
                value={timeValue ?? "00:00:00"}
                onChange={(e) => {
                  setTimeValue(e.target.value);
                  update(undefined, undefined, e.target.value);
                }}
              />
            );
          default:
            return <div>Unsupported type: {configVal.tsType}</div>;
        }

      case StateType.Discrete:
        return (
          <Select
            data={configVal.values?.map((v) => ({ label: v.label, value: v.value })) || []}
            value={selectValue}
            onChange={(s) => {
              setSelectValue(s);
              update(undefined, undefined, s as string | number | boolean);
            }}
            checkIconPosition="right"
          />
        );

      default:
        return <div>Unsupported value type</div>;
    }
  };

  return (
    <div className="grid w-full grid-cols-[1fr_auto] items-center gap-2">
      <div className="grid grid-cols-3 items-center gap-2">
        <Select
          data={fieldSelection}
          value={selectedValueRef}
          onChange={(e) => {
            setSelectedValueRef(e);
            update(undefined, e!, undefined);
          }}
          checkIconPosition="right"
        ></Select>
        <Select
          data={allowedComparators}
          value={selectedComparator}
          onChange={(e) => {
            setSelectedComparator(e);
            update(e!, undefined, undefined);
          }}
          checkIconPosition="right"
        ></Select>
        {getInput()}
      </div>

      <div className="flex flex-row items-center justify-end gap-2">
        <Tooltip label="Make Group" withArrow position="top">
          <ActionIcon
            size="md"
            variant="transparent"
            onClick={() => {
              const newNode: RuleConnector = { ["and"]: [rulePart] };
              updateEditCopy(newNode);
            }}
          >
            <IconCategoryPlus />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete" withArrow position="top">
          <ActionIcon
            variant="transparent"
            color="red"
            size="sm"
            onClick={() => updateEditCopy(undefined)}
            disabled={level === 0}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
}
