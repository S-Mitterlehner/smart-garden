import { Accordion, Button, Tooltip } from "@mantine/core";
import { IconPlus, IconSquareCheck, IconSquareX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { v4 as guid } from "uuid";
import { AutomationRuleDto } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";
import RuleListPane from "./RuleListPane";

export default function RuleList() {
  const { rules: rules, bed } = useAutomationContext();
  const [localRules, setLocalRules] = useState<AutomationRuleDto[]>([]);
  const [openedAccordionItem, setOpenedAccordionItem] = useState<string | null>(null);

  useEffect(() => {
    setLocalRules(rules);
  }, [rules]);

  const addRule = () => {
    const newRule: AutomationRuleDto = {
      bedId: bed.id,
      expressionJson: '{ gt: [{ var: "" }, 0]} ',
      id: guid(),
      name: "New Rule",
      isEnabled: true,
      actions: [],
    };
    setLocalRules([...localRules, newRule]);
    setOpenedAccordionItem(`rule-${localRules.length}`);
  };

  if (!localRules) {
    return <p className="text-gray-500 italic">Loading ...</p>;
  } else if (localRules!.length <= 0) {
    return (
      <>
        <div className="mb-4 flex flex-row items-center justify-end">
          <Button variant="subtle" onClick={() => addRule()}>
            <IconPlus />
            Add Rule
          </Button>
        </div>
        <p className="text-gray-500 italic">No automation rules configured.</p>
      </>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-row items-center justify-end">
        <Button variant="subtle" onClick={() => addRule()}>
          <IconPlus />
          Add Rule
        </Button>
      </div>
      <Accordion value={openedAccordionItem} onChange={setOpenedAccordionItem}>
        {localRules.map((rule, index) => (
          <Accordion.Item key={index} value={`rule-${index}`}>
            <Accordion.Control>
              <div className="flex flex-row items-center justify-start gap-2 pr-4">
                {rule.isEnabled ? (
                  <Tooltip label="Enabled" withArrow position="top">
                    <IconSquareCheck className="text-green-500" />
                  </Tooltip>
                ) : (
                  <Tooltip label="Disabled" withArrow position="top">
                    <IconSquareX className="text-red-500" />
                  </Tooltip>
                )}
                <p>{rule.name}</p>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              <RuleListPane root={rule} />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
