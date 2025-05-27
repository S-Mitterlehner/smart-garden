import { Accordion, ActionIcon, Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useAutomationContext } from "../../hooks/useAutomation";
import RuleEditor from "./RuleEditor";

export default function RuleList() {
  const { rules } = useAutomationContext();

  if (!rules || rules!.length <= 0) {
    return <div>Loading...</div>;
  }
  // TODO: improve to give name
  return (
    <Accordion>
      {rules.map((rule, index) => (
        <Accordion.Item key={index} value={`rule-${index}`}>
          <Accordion.Control>
            <div className="flex flex-row items-center justify-between pr-4">
              <p>Rule {index + 1}</p>
              <ActionIcon
                variant="transparent"
                color="red"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Delete rule not implemented yet");
                }}
              >
                <IconTrash />
              </ActionIcon>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <RuleEditor rulePart={rule} />
            <div className="mt-16 flex flex-row justify-end">
              <Button variant="filled">Save</Button>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
