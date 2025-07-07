import { Button, Switch, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { AutomationRuleActionDto, AutomationRuleDto } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";
import { Rule } from "../../models/automation";
import ConfirmModal from "../ConfirmModal";
import { RuleActionList } from "./RuleActionList";
import RuleEditor from "./RuleEditor";

export default function RuleListPane({ root: rule }: { root: AutomationRuleDto }) {
  const [editCopy, setEditCopy] = useState<Rule | null>(null);
  const [localActionList, setLocalActionList] = useState<AutomationRuleActionDto[]>([]);
  const [ruleName, setRuleName] = useState<string | null>(rule.name);
  const [ruleEnabled, setRuleEnabled] = useState<boolean>(rule.isEnabled);

  const { saveRule, deleteRule } = useAutomationContext();
  const [confirmModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  useEffect(() => {
    setEditCopy(JSON.parse(JSON.stringify(rule.expressionJson)));
    setLocalActionList(JSON.parse(JSON.stringify(rule.actions ?? [])));
  }, [rule]);

  if (editCopy === null) {
    return <div>Loading...</div>;
  }

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
        <RuleActionList actionList={localActionList} actionListChange={setLocalActionList} ruleId={rule.id} />
      </div>

      <div className="flex flex-row justify-between gap-2">
        <Button variant="outline" color="red" onClick={openDeleteModal}>
          Delete
        </Button>
        <Button
          variant="filled"
          onClick={() =>
            saveRule({
              ...rule,
              expressionJson: JSON.stringify(editCopy),
              name: ruleName ?? "",
              isEnabled: ruleEnabled,
              actions: localActionList,
            })
          }
        >
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
