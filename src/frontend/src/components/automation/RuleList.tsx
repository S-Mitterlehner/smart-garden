import { Accordion, Button, Switch, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconSquareCheck, IconSquareX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AutomationRuleDto } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";
import { Rule } from "../../models/automation";
import ConfirmModal from "../ConfirmModal";
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

export function RuleListPane({ root: rule }: { root: AutomationRuleDto }) {
  const [editCopy, setEditCopy] = useState<Rule | null>(null);
  const [ruleName, setRuleName] = useState<string | null>(rule.name);
  const [ruleEnabled, setRuleEnabled] = useState<boolean>(rule.isEnabled);

  const { addRule, updateRule, deleteRule } = useAutomationContext();
  const [confirmModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

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
    <div className="flex flex-col gap-8">
      <div className="mb-4 flex flex-row items-end justify-between gap-4">
        <TextInput
          label="Rule Name"
          className="w-1/2"
          value={ruleName ?? ""}
          onChange={(event) => setRuleName(event.currentTarget.value)}
        />
        <Switch
          className="-translate-y-2"
          checked={ruleEnabled}
          labelPosition="left"
          label={"Rule " + (ruleEnabled ? "Enabled" : "Disabled")}
          onChange={(event) => setRuleEnabled(event.currentTarget.checked)}
        />
      </div>

      <div className="border-t border-t-gray-200 pt-4">
        <h3 className="mb-1 text-lg font-medium tracking-wide text-gray-800">Rule</h3>
        <p className="mb-6 text-xs text-gray-500">Rule that must be met for the actions to be executed.</p>
        <div className="pb-4">
          <RuleEditor
            rulePart={editCopy}
            updateEditCopy={(r) => {
              if (!r) return; // root can't be null
              setEditCopy(r);
            }}
          />
        </div>
      </div>

      <div className="border-t border-t-gray-200 pt-4">
        <ActionList rule={rule} />
      </div>

      <div className="flex flex-row justify-between gap-2">
        <Button variant="outline" color="red" onClick={openDeleteModal}>
          Delete
        </Button>
        <Button variant="filled" onClick={saveRule}>
          Save
        </Button>
      </div>

      <ConfirmModal
        title="Delete Rule"
        description={`Are you sure you want to delete rule "${ruleName}"? This action cannot be undone.`}
        opened={confirmModalOpened}
        cancelled={closeDeleteModal}
        confirmed={() => {
          deleteRule(rule);
          closeDeleteModal();
        }}
      ></ConfirmModal>
    </div>
  );
}
