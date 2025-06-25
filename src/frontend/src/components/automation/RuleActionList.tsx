import { AutomationRuleActionDto, AutomationRuleDto } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";
import { ModuleActionMenu } from "./ModuleActionMenu";
import { RuleAction } from "./RuleAction";

export function RuleActionList({ rule }: { rule: AutomationRuleDto }) {
  const ruleActions = (rule.actions ?? []) as AutomationRuleActionDto[];
  const { modules } = useAutomationContext();

  return (
    <>
      <div className="flex flex-row items-center">
        <div className="w-full">
          <h3 className="mb-1 text-lg font-medium tracking-wide text-gray-800">Actions</h3>
          <p className="mb-6 text-xs text-gray-500">Actions which are going to be executed when the rule is met.</p>
        </div>
        <ModuleActionMenu modules={modules} ruleId={rule.id} actionsInUse={ruleActions}></ModuleActionMenu>
      </div>

      {ruleActions?.length ? (
        <ul className="space-y-2">
          {ruleActions.map((action) => (
            <li
              key={action.id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2"
            >
              <RuleAction action={action} module={modules.find((m) => m.id == action.moduleId)}></RuleAction>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No actions configured.</p>
      )}
    </>
  );
}
