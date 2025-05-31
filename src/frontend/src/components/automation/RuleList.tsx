import { Accordion, Button, Checkbox, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconSquareCheck, IconSquareX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AutomationRuleDto } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";
import { Rule } from "../../models/automation";
import { ActionList } from "./ActionList";
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
      isEnabled: true,
    };
    setLocalRules([...localRules, newRule]);
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

export function RuleListPane({ root: rule }: { root: AutomationRuleDto }) {
  const [editCopy, setEditCopy] = useState<Rule | null>(null);
  const [ruleName, setRuleName] = useState<string | null>(rule.name);
  const [ruleEnabled, setRuleEnabled] = useState<boolean>(rule.isEnabled);

  const { addRule, updateRule, deleteRule } = useAutomationContext();
  const [opened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  useEffect(() => {
    setEditCopy(JSON.parse(JSON.stringify(rule.expressionJson)));
  }, [rule]);

  if (editCopy === null) {
    return <div>Loading...</div>;
  }

  const saveRule = () => {
    console.log("Saving rule:", JSON.stringify(editCopy));

    if (rule.id) {
      updateRule(rule.id, ruleName ?? "", editCopy, ruleEnabled);
    } else {
      addRule(ruleName ?? "", editCopy, ruleEnabled);
    }
  };

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

      <div className="mt-6">
        <ActionList rule={rule} />
      </div>

      <div className="mt-10 flex flex-row justify-end gap-2">
        <Button variant="filled" color="red" onClick={openDeleteModal}>
          Delete Rule
        </Button>
        <Button variant="filled" onClick={saveRule}>
          Save Rule
        </Button>
      </div>

      <Modal opened={opened} onClose={closeDeleteModal} title="Delete Rule?" centered>
        <p>
          Are you sure you want to delete <strong>{ruleName || "this rule"}</strong>?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="default" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              deleteRule(rule);
              closeDeleteModal();
            }}
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
