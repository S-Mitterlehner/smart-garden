import { Accordion, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAutomationContext } from "../../hooks/useAutomation";
import { Rule } from "../../models/automation";
import RuleEditor from "./RuleEditor";
import { AutomationRuleDto, useAddAutomationRuleToBedMutation, useUpdateAutomationRuleFromBedMutation } from "../../__generated__/graphql";
import { notifications } from "@mantine/notifications";
import { useBedContext } from "../../hooks/useCurrentBed";

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
      name: ""
    };
    setLocalRules([...localRules, newRule]);
  };


  if (!localRules || localRules!.length <= 0) {
    return <div>Loading...</div>;
  }
  // TODO: improve to give name
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
              <div className="flex flex-row items-center justify-between pr-4">
                <p>Rule {index + 1} - {rule.name}</p>
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

  const [addAutomationRuleMutation] = useAddAutomationRuleToBedMutation();
  const [updateAutomationRuleMutation] = useUpdateAutomationRuleFromBedMutation();
  const { bed, refetch } = useBedContext();

  useEffect(() => {
    setEditCopy(JSON.parse(JSON.stringify(root.expressionJson)));
  }, [root]);

  if (editCopy === null) {
    return <div>Loading...</div>;
  }

  const save = () => {
    console.log("Saving rule:", JSON.stringify(editCopy));

    var expressionJson: string = JSON.stringify(editCopy);

    // TODO where should we get this value?
    var automationName: string = "TestAutomation";

    if (root.id) {
      updateAutomationRuleMutation({
        variables: {
          bedId: bed.id,
          expressionJson: expressionJson,
          id: root.id,
          name: automationName
        }
      })
      .then((r) => {
        console.log(r);
        notifications.show({
          title: `${automationName} updated`,
          message: `Automation ${automationName} updated`,
          color: "green",
        });
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to update automation rule ${automationName} from bed with id ${bed.id}`,
          color: "red"
        })
      });
    } else {

      // TODO: Refetch automation rules when adding new ones (remove local copy)
      addAutomationRuleMutation({
        variables: {
          bedId: bed.id,
          automationExpressionJson: expressionJson,
          automationName: automationName
        }
      })
      .then((r) => {
        refetch();
        console.log(r);
        notifications.show({
          title: `${automationName} added`,
          message: `Automation ${automationName} added to bed`,
          color: "green",
        });
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to add automation rule ${automationName} to bed with id ${bed.id}`,
          color: "red"
        })
      });
    }
    

    // TODO: Call API (GraphQL mutation) to save the rule
    // TODO: Add enabled checkbox
  };

  return (
    <>
      <RuleEditor
        rulePart={editCopy}
        updateEditCopy={(r) => {
          if (!r) return; // root can't be null
          setEditCopy(r);
        }}
      />
      <div className="mt-16 flex flex-row justify-end">
        <Button variant="filled" onClick={save}>
          Save
        </Button>
      </div>
    </>
  );
}
