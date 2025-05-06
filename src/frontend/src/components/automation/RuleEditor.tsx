import { AutomationConfig, RuleElement } from "../../models/automation";
import { useAutomationContext } from "../../hooks/useAutomation";
import { Select } from "@mantine/core";
import { useEffect, useState } from "react";

const connectors = [
  { label: "AND", value: "and" },
  { label: "OR", value: "or" },
  { label: "NOT", value: "not" },
];

const comparators = [
  { label: "=", value: "==" },
  { label: "!=", value: "!=" },
  { label: "<", value: "<" },
  { label: "<=", value: "<=" },
  { label: ">", value: ">" },
  { label: ">=", value: ">=" },
];

export type RuleEditorProps = {
  rule: RuleElement;
  config: AutomationConfig[];
};

export function RuleList() {
  const { rules } = useAutomationContext();

  return (
    <div>
      {/* TODO */}
      <RuleEditor root={rules[0]} />
    </div>
  );
}

export function RuleEditor({ root }: { root: RuleElement }) {
  if (!root) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Rule rulePart={root} />
    </div>
  );
}

export function RuleGroup() {
  return <div></div>;
}

export function Rule({ rulePart }: { rulePart: RuleElement }) {
  const [ruleKey] = Object.keys(rulePart);
  const parts = rulePart[ruleKey] as RuleElement[];

  const { config, fieldSelection } = useAutomationContext();
  const [type, setType] = useState<"comparator" | "connector" | null>(null);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedComparator, setSelectedComparator] = useState<string | null>(
    null
  );

  // group items by connectorKey

  useEffect(() => {
    setType(
      connectors.find((i) => i.value === ruleKey) ? "connector" : "comparator"
    );
  }, [ruleKey]);

  const getInput = () => {
    return <div>TODO</div>;
  };

  if (type === "connector") {
    return (
      <div>
        {/* TODO: connector-selection */}
        {parts.map((part, index) => {
          return (
            <div key={index}>
              <Rule rulePart={part} />
            </div>
          );
        })}
      </div>
    );
  }

  console.log("selection", fieldSelection);

  return (
    <div className="flex flex-row gap-2 items-center">
      <Select
        data={fieldSelection}
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
