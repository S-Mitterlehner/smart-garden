import { Accordion, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAutomationContext } from "../../hooks/useAutomation";
import { Rule } from "../../models/automation";
import RuleEditor from "./RuleEditor";
import { useAddAutomationRuleToBedMutation } from "../../__generated__/graphql";
import { notifications } from "@mantine/notifications";
import { useBedContext } from "../../hooks/useCurrentBed";

export default function RuleList() {
  const { rules } = useAutomationContext();

  if (!rules || rules!.length <= 0) {
    return <div>Loading...</div>;
  }
  // TODO: improve to give name
  return (
    <div>
      <div className="mb-4 flex flex-row items-center justify-end">
        <Button variant="subtle" onClick={() => alert("Add rule not implemented yet")}>
          <IconPlus />
          Add Rule
        </Button>
      </div>
      <Accordion>
        {rules.map((rule, index) => (
          <Accordion.Item key={index} value={`rule-${index}`}>
            <Accordion.Control>
              <div className="flex flex-row items-center justify-between pr-4">
                <p>Rule {index + 1}</p>
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

export function RuleListPane({ root }: { root: Rule }) {
  const [editCopy, setEditCopy] = useState<Rule | null>(null);

  const [addAutomationRuleMutation] = useAddAutomationRuleToBedMutation();
  const { bed } = useBedContext();

  useEffect(() => {
    setEditCopy(JSON.parse(JSON.stringify(root)));
  }, [root]);

  if (editCopy === null) {
    return <div>Loading...</div>;
  }

  const save = () => {
    console.log("Saving rule:", JSON.stringify(editCopy));

    var expressionJson: string = JSON.stringify(editCopy);

    // TODO where should we get this value?
    var automationName: string = "TestAutomation";

    addAutomationRuleMutation({
      variables: {automationExpressionJson: expressionJson, automationName: automationName, bedId: bed.id}
    })
    .then((r) => {
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
