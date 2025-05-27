import { Accordion, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAutomationContext } from "../../hooks/useAutomation";
import { Rule } from "../../models/automation";
import RuleEditor from "./RuleEditor";

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

  useEffect(() => {
    setEditCopy(JSON.parse(JSON.stringify(root)));
  }, [root]);

  if (editCopy === null) {
    return <div>Loading...</div>;
  }

  const save = () => {
    console.log("Saving rule:", JSON.stringify(editCopy));

    alert("Saving rule not implemented yet");

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
