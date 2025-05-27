import { useEffect, useMemo, useState } from "react";
import { AutomationConfig, Rule, RuleConnector, RuleElement } from "../../models/automation";
import RuleConnectorComponent, { connectors } from "./RuleConnectorComponent";
import RuleElementComponent from "./RuleElementComponent";

export type RuleEditorProps = {
  rule: RuleElement;
  config: AutomationConfig[];
};

export default function RuleEditor({ rulePart, level = 0 }: { rulePart: Rule; level?: number }) {
  const ruleKey = useMemo(() => Object.keys(rulePart)[0], [rulePart]);
  const [type, setType] = useState<"comparator" | "connector" | null>(null);

  useEffect(() => {
    setType(connectors.find((i) => i.value === ruleKey) ? "connector" : "comparator");
  }, [ruleKey]);
  const getRulePartComponent = () => {
    if (type === "connector") return <RuleConnectorComponent rulePart={rulePart as RuleConnector} level={level} />;
    if (type === "comparator") return <RuleElementComponent rulePart={rulePart as RuleElement} />;
    return <div>Invalid rule part</div>;
  };

  const style = {
    marginLeft: `${level * 3}rem`,
  };

  return <div style={style}>{getRulePartComponent()}</div>;
}
