import { Button } from "@mantine/core";
import { AutomationRuleActionDto, AutomationRuleDto } from "../../__generated__/graphql";
import { useAutomationContext } from "../../hooks/useAutomation";

export function ActionList({ rule }: { rule: AutomationRuleDto }) {
  const actions = rule.actions as AutomationRuleActionDto[] | undefined;
  const { deleteAction } = useAutomationContext();

  return (
    <>
      <h3 className="mb-2 font-medium">Automation Actions</h3>
      {actions?.length ? (
        <ul className="space-y-2">
          {actions.map((action) => (
            <li
              key={action.id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2"
            >
              <div>
                <p className="font-medium">{action.actionKey || "Unknown Action"}</p>
                <p className="text-md text-gray-700">
                  Module: {action.moduleKey ?? "Unknown Module"} | Type: {action.moduleType ?? "Unknown Type"} | Value:{" "}
                  {action.value ?? "—"}
                </p>
              </div>
              <Button variant="subtle" color="red" size="s" onClick={() => deleteAction(action)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No actions configured.</p>
      )}
    </>
  );
}
