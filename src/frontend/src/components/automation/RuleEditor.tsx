import { Select } from "@mantine/core";
import { AutomationConfig } from "../../models/automation";
import { useState } from "react";
import { useAutomation } from "../../hooks/useAutomation";

export type RuleEditorProps = {
  config: AutomationConfig[];
};

export default function RuleEditor() {
  const { rules, config } = useAutomation();

  return <div></div>;
}

export function RuleGroup() {
  return <div></div>;
}

export function Rule({ rulePart }: { rulePart: string }) {
  const { config } = useAutomation();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedComparator, setSelectedComparator] = useState<string | null>(
    null
  );

  // group items by connectorKey
  const selection = config?.fields.reduce((acc, item) => {
    const { connectorKey, type } = item;
    if (!acc[connectorKey]) {
      acc[connectorKey] = [];
    }
    acc[connectorKey].push(type);
    return acc;
  }, {} as any);

  const comparators = [
    { label: "=", value: "==" },
    { label: "!=", value: "!=" },
    { label: "<", value: "<" },
    { label: "<=", value: "<=" },
    { label: ">", value: ">" },
    { label: ">=", value: ">=" },
  ];

  const getInput = () => {
    return <div>TODO</div>;
  };

  return (
    <div>
      <Select
        data={selection}
        value={selectedValue}
        onChange={setSelectedValue}
      ></Select>
      <Select
        data={comparators}
        value={selectedComparator}
        onChange={setSelectedComparator}
      ></Select>
      {getInput()}
    </div>
  );
}
