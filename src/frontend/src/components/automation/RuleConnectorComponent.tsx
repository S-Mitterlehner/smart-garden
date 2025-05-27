import { ActionIcon, Select, Tooltip } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Rule, RuleConnector, RuleElement } from "../../models/automation";
import RuleEditor from "./RuleEditor";

export const connectors = [
  { label: "AND", value: "and" },
  { label: "OR", value: "or" },
  { label: "NOT", value: "not" },
];

export default function RuleConnectorComponent({
  rulePart,
  level = 0,
  updateEditCopy = () => {},
}: {
  rulePart: RuleConnector;
  level?: number;
  updateEditCopy?: (rule: Rule | undefined) => void;
}) {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const ruleKey = useMemo(() => Object.keys(rulePart)[0], [rulePart]);
  const subElements = useMemo(() => rulePart[ruleKey], [rulePart, ruleKey]);

  useEffect(() => {
    setSelectedConnector(ruleKey);
  }, [ruleKey]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="grid grid-cols-3 gap-2">
          <Select
            data={connectors}
            value={selectedConnector}
            onChange={setSelectedConnector}
            checkIconPosition="right"
          ></Select>
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <Tooltip label="Add Element" withArrow position="top">
            <ActionIcon
              size="md"
              variant="transparent"
              onClick={() => {
                const newSubElement: RuleElement = { ["="]: [null, null] };
                subElements.push(newSubElement);
                const updatedRule = { ...rulePart, [ruleKey]: subElements };
                updateEditCopy(updatedRule);
              }}
            >
              <IconPlus />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete" withArrow position="top">
            <ActionIcon
              variant="transparent"
              disabled={level === 0}
              color="red"
              size="sm"
              onClick={() => updateEditCopy(undefined)}
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      {subElements.map((subElement, index) => (
        <RuleEditor
          rulePart={subElement}
          key={index}
          level={level + 1}
          updateEditCopy={(r) => {
            if (!r) {
              const updatedSubElements = subElements.filter((_, i) => i !== index);
              updateEditCopy({ ...rulePart, [ruleKey]: updatedSubElements });
              return;
            }

            const updatedSubElements: Rule[] = [...subElements];
            updatedSubElements[index] = r;
            updateEditCopy({ ...rulePart, [ruleKey]: updatedSubElements });
          }}
        />
      ))}
    </div>
  );
}
