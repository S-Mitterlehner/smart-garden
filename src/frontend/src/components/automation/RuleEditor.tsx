import { useEffect, useMemo, useState } from "react";
import { AutomationConfig, Rule, RuleConnector, RuleElement } from "../../models/automation";
import RuleConnectorComponent, { connectors } from "./RuleConnectorComponent";
import RuleElementComponent from "./RuleElementComponent";

export type RuleEditorProps = {
  rule: RuleElement;
  config: AutomationConfig[];
};

export default function RuleEditor({
  rulePart,
  level = 0,
  updateEditCopy = () => {},
}: {
  rulePart: Rule;
  level?: number;
  updateEditCopy?: (rule: Rule | undefined) => void;
}) {
  if (!rulePart) return <div>Invalid rule (no rulePart)</div>;
  const ruleKey = useMemo(() => Object.keys(rulePart)[0], [rulePart]);
  const [type, setType] = useState<"comparator" | "connector" | null>(null);

  useEffect(() => {
    setType(connectors.find((i) => i.value === ruleKey) ? "connector" : "comparator");
  }, [ruleKey]);
  const getRulePartComponent = () => {
    if (type === "connector")
      return (
        <RuleConnectorComponent rulePart={rulePart as RuleConnector} level={level} updateEditCopy={updateEditCopy} />
      );
    if (type === "comparator")
      return <RuleElementComponent rulePart={rulePart as RuleElement} level={level} updateEditCopy={updateEditCopy} />;
    return <div>Invalid rule part</div>;
  };

  return <div className={level > 0 ? "ml-12" : ""}>{getRulePartComponent()}</div>;
}
