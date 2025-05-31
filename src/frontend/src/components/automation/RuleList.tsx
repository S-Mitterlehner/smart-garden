import { Accordion, Button, Checkbox, TextInput } from "@mantine/core";
import { IconPlus, IconSquareCheck, IconSquareX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AutomationRuleDto } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";
import { Rule } from "../../models/automation";
import RuleEditor from "./RuleEditor";

export default function RuleList() {
  const { rules: rules } = useAutomationContext();
  const [localRules, setLocalRules] = useState<AutomationRuleDto[]>([]);

  useEffect(() => {
    setLocalRules(rules);
  }, [rules]);

  const addRule = () => {
    const newRule: AutomationRuleDto = {
      bedId: undefined,
      expressionJson: '{ gt: [{ var: "" }, 0]} ',
      id: undefined,
      name: "",
      isEnabled: true
    };
    setLocalRules([...localRules, newRule]);
  };

  if (!localRules || localRules!.length <= 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-row items-center justify-end">
        <Button variant="subtle" onClick={() => addRule()}>
          <IconPlus />
          Add Rule
        </Button>
      </div>
      <Accordion>
        {localRules.map((rule, index) => (
          <Accordion.Item key={index} value={`rule-${index}`}>
            <Accordion.Control>
              <div className="flex flex-row items-center justify-start gap-2 pr-4">
                {rule.isEnabled ? (
                  <IconSquareCheck className="text-green-500" />
                ) : (
                  <IconSquareX className="text-red-500" />
                )}
                <p>
                  Rule {index + 1} - {rule.name}
                </p>
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

export function RuleListPane({ root }: { root: AutomationRuleDto }) {
  const [editCopy, setEditCopy] = useState<Rule | null>(null);
  const [ruleName, setRuleName] = useState<string | null>(root.name);
  const [ruleEnabled, setRuleEnabled] = useState<boolean>(root.isEnabled);

  const { addRule, updateRule } = useAutomationContext();

  useEffect(() => {
    setEditCopy(JSON.parse(JSON.stringify(root.expressionJson)));
  }, [root]);

  if (editCopy === null) {
    return <div>Loading...</div>;
  }

  const save = () => {
    console.log("Saving rule:", JSON.stringify(editCopy));

    if (root.id) {
      updateRule(root.id, ruleName ?? "", editCopy, ruleEnabled);
    } else {
      addRule(ruleName ?? "", editCopy, ruleEnabled);
    }
  };

  function handleDeleteAction(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div>
        <h3 className="mb-2 font-medium">Automation Data</h3>
        <div className="mb-4 flex items-center gap-4">
          <TextInput
            placeholder="Rule Name"
            className="w-1/2"
            value={ruleName ?? ""}
            onChange={(event) => setRuleName(event.currentTarget.value)}
          />
          <Checkbox
            checked={ruleEnabled}
            label="Rule Enabled"
            onChange={(event) => setRuleEnabled(event.currentTarget.checked)}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 font-medium">Automation Logic</h3>
        <RuleEditor
          rulePart={editCopy}
          updateEditCopy={(r) => {
            if (!r) return; // root can't be null
            setEditCopy(r);
          }}
        />
      </div>
      
      {/* TODO: Move to own module?? */}
      <div className="mt-6">
        <h3 className="mb-2 font-medium">Automation Actions</h3>
        {root.actions?.length ? (
          <ul className="space-y-2">
            {root.actions.map((action) => (
              <li
                key={action.id}
                className="flex items-center justify-between p-2 border border-gray-200 rounded-md bg-gray-50"
              >
                <div>
                  <p className="font-medium">{action.actionKey || "Unknown Action"}</p>
                  <p className="text-md text-gray-700">
                    Module: {action.moduleKey ?? "Unknown Module"} | Type: {action.moduleType ?? "Unknown Type"} | Value: {action.value ?? "—"}
                  </p>
                </div>
                <Button
                  variant="subtle"
                  color="red"
                  size="s"
                  onClick={() => handleDeleteAction(action.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No actions configured.</p>
        )}
      </div>


      <div className="mt-10 flex flex-row justify-end">
        <Button variant="filled" onClick={save}>
          Save
        </Button>
      </div>
    </>
  );
}
