import { NumberInput, Select } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useEffect, useMemo, useState } from "react";
import { StateType } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";
import { RuleElement, RuleValueRef } from "../../models/automation";

const comparators = [
  { label: "=", value: "==" },
  { label: "!=", value: "!=" },
  { label: "<", value: "<" },
  { label: "<=", value: "<=" },
  { label: ">", value: ">" },
  { label: ">=", value: ">=" },
];

export default function RuleElementComponent({ rulePart }: { rulePart: RuleElement }) {
  const { fieldSelection, parameterFields } = useAutomationContext();

  const ruleKey = useMemo(() => Object.keys(rulePart)[0], [rulePart]);
  const ruleValueRef = useMemo<RuleValueRef>(() => rulePart[ruleKey][0] as RuleValueRef, [rulePart, ruleKey]);
  const ruleValue = useMemo(() => rulePart[ruleKey][1], [rulePart, ruleKey]);

  const [numValue, setNumValue] = useState<number>(0);
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [timeValue, setTimeValue] = useState<string>("00:00:00");

  const [selectedValueRef, setSelectedValueRef] = useState<string | null>(null);
  const [selectedComparator, setSelectedComparator] = useState<string | null>(null);

  useEffect(() => {
    setSelectedComparator(ruleKey);
    setSelectedValueRef(ruleValueRef.var);
    setNumValue(ruleValue as number);
    setSelectValue(ruleValue as string | null);
    setTimeValue(ruleValue as string);
  }, [fieldSelection, ruleValueRef, ruleKey, ruleValue]);

  const getInput = () => {
    const configVal = parameterFields?.find((f) => f.key === selectedValueRef);
    if (!configVal) {
      return <div>Invalid field selection</div>;
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
                value={numValue}
                onChange={(e) => setNumValue(e as number)}
              />
            );
          case "time":
            return (
              <TimeInput
                withSeconds
                placeholder="Enter time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
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
            onChange={setSelectValue}
            checkIconPosition="right"
          />
        );

      default:
        return <div>Unsupported value type</div>;
    }
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <Select
        data={fieldSelection}
        value={selectedValueRef}
        onChange={setSelectedValueRef}
        checkIconPosition="right"
      ></Select>
      <Select
        data={comparators}
        value={selectedComparator}
        onChange={setSelectedComparator}
        checkIconPosition="right"
      ></Select>
      {getInput()}
    </div>
  );
}
