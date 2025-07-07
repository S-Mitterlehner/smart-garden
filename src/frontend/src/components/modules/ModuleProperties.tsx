import { Badge, Button, Textarea, TextInput, Tooltip } from "@mantine/core";
import { useState } from "react";
import { ConnectionState, StateType } from "../../__generated__/graphql";
import { useModuleContext } from "../../hooks/useModule";
import { getTimeString } from "../../utils";
import PropertyEntry from "../properties/PropertyEntry";
import "../styles/properties.css";
import { getTypeIconCircle } from "./utils";

export default function ModuleProperties() {
  const { module: module, state, connectionState, updateRef } = useModuleContext();
  const [name, setName] = useState(module.name);
  const [description, setDescription] = useState(module.description);
  const [hasChanges, setHasChanges] = useState(false);

  const saveChanges = async () => {
    await updateRef(module.id, {
      ...module,
      name: name,
      description: description,
    });
    setHasChanges(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-8">
          <Tooltip label={module.type} position="top" withArrow>
            {getTypeIconCircle(module.type, { size: "xl" })}
          </Tooltip>

          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Device-Id</span>
            <span className="text-sm text-gray-600">{module.key}</span>
          </div>

          <div className="flex flex-col items-end gap-2">
            {connectionState === ConnectionState.NotConnected ? (
              <Badge radius="sm" color="red">
                Not Connected
              </Badge>
            ) : (
              <Badge radius="sm" color="emerald">
                Connected
              </Badge>
            )}
            <div className="flex flex-col items-end">
              <span className="line-clamp-1 text-xs text-gray-400">Last Update</span>
              <span className="line-clamp-1 text-xs text-gray-600">{getTimeString(state?.lastUpdate)}</span>
            </div>
          </div>
        </div>

        <span className="mt-6 mb-2 border-b border-gray-300" />

        <div>
          <span className="inline-block translate-y-3 text-sm text-gray-400">Name</span>
          <TextInput
            className="properties-input properties-title"
            variant="unstyled"
            size="xl"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value);
              setHasChanges(true);
            }}
          />
        </div>
        <div>
          <span className="inline-block translate-y-1 text-xs text-gray-400">Description</span>
          <Textarea
            className="properties-input properties-description"
            rows={3}
            variant="unstyled"
            value={description}
            onChange={(e) => {
              setDescription(e.currentTarget.value);
              setHasChanges(true);
            }}
          />
        </div>
        <div className="mt-4 flex flex-row justify-end gap-2">
          <Tooltip label="No Changes" position="top" withArrow disabled={hasChanges}>
            <Button variant="filled" disabled={!hasChanges} onClick={saveChanges}>
              Save
            </Button>
          </Tooltip>
        </div>

        <span className="mt-6 mb-4 border-b border-gray-300" />

        <h4 className="text-md mb-4 font-semibold text-gray-600">State</h4>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {state?.stateType === StateType.Discrete ? (
            <PropertyEntry property="State" value={state?.state ?? ""} />
          ) : null}
          {state?.stateType === StateType.Continuous ? (
            <>
              <PropertyEntry property="Value" value={state?.value ?? ""} unit={state?.unit ?? ""} />
              <PropertyEntry property="Min" value={state?.min ?? ""} unit={state?.unit ?? ""} />
              <PropertyEntry property="Max" value={state?.max ?? ""} unit={state?.unit ?? ""} />
            </>
          ) : null}
        </div>

        {/* <span className="border-b border-gray-300 mt-6 mb-2" /> */}
      </div>
    </div>
  );
}
