import { Select } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { RuleConnector } from "../../models/automation";
import RuleEditor from "./RuleEditor";

export const connectors = [
  { label: "AND", value: "and" },
  { label: "OR", value: "or" },
  { label: "NOT", value: "not" },
];

export default function RuleConnectorComponent({ rulePart, level = 0 }: { rulePart: RuleConnector; level?: number }) {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const ruleKey = useMemo(() => Object.keys(rulePart)[0], [rulePart]);
  const subElements = useMemo(() => rulePart[ruleKey], [rulePart, ruleKey]);

  useEffect(() => {
    setSelectedConnector(ruleKey);
  }, [ruleKey]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <Select
          data={connectors}
          value={selectedConnector}
          onChange={setSelectedConnector}
          checkIconPosition="right"
        ></Select>
      </div>
      {subElements.map((subElement, index) => (
        <RuleEditor key={index} rulePart={subElement} level={level + 1} />
      ))}
    </div>
  );
}
