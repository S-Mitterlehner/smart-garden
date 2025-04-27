import { Badge, Button, Textarea, TextInput, Tooltip } from "@mantine/core";
import { useState } from "react";
import "../styles/properties.css";
import { getTypeIconCircle } from "./utils";
import { ConnectionState } from "../../models/general";
import { getTimeString } from "../../utils";
import { useActuatorContext } from "../../hooks/useActuator";
import PropertyEntry from "../properties/PropertyEntry";
import { StateType } from "../../models/actuator";

export default function ActuatorProperties() {
  const { actuator, state, connectionState, updateRef } = useActuatorContext();
  const [name, setName] = useState(actuator.name);
  const [description, setDescription] = useState(actuator.description);
  const [hasChanges, setHasChanges] = useState(false);

  const saveChanges = async () => {
    await updateRef(actuator.id, {
      ...actuator,
      name: name,
      description: description,
    });
    setHasChanges(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[auto_1fr_auto] gap-8 items-center">
          <Tooltip label={actuator.type} position="top" withArrow>
            {getTypeIconCircle(actuator.type, "w-10 h-10")}
          </Tooltip>

          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Device-Id</span>
            <span className="text-sm text-gray-600">{actuator.key}</span>
          </div>

          <div className="flex flex-col gap-2 items-end">
            {connectionState === ConnectionState.NotConnected ? (
              <Badge radius="sm" color="red">
                Not Connected
              </Badge>
            ) : (
              <Badge radius="sm" color="oklch(69.6% 0.17 162.48)">
                Connected
              </Badge>
            )}
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 line-clamp-1">
                Last Update
              </span>
              <span className="text-xs text-gray-600 line-clamp-1">
                {getTimeString(state?.lastUpdate)}
              </span>
            </div>
          </div>
        </div>

        <span className="border-b border-gray-300 mt-6 mb-2" />

        <div>
          <span className="text-sm translate-y-3 inline-block text-gray-400">
            Name
          </span>
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
          <span className="text-xs translate-y-1 inline-block text-gray-400">
            Description
          </span>
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
        <div className="flex flex-row gap-2 mt-4 justify-end">
          <Tooltip
            label="No Changes"
            position="top"
            withArrow
            disabled={hasChanges}
          >
            <Button
              variant="filled"
              color="oklch(69.6% 0.17 162.48)"
              disabled={!hasChanges}
              onClick={saveChanges}
            >
              Save
            </Button>
          </Tooltip>
        </div>

        <span className="border-b border-gray-300 mt-6 mb-4" />

        <h4 className="text-md text-gray-600 font-semibold mb-4">State</h4>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {state?.stateType === StateType.Discrete ? (
            <PropertyEntry property="State" value={state?.state} />
          ) : null}
          {state?.stateType === StateType.Continuous ? (
            <>
              <PropertyEntry
                property="Value"
                value={state?.value}
                unit={state?.unit}
              />
              <PropertyEntry
                property="Min"
                value={state?.min}
                unit={state?.unit}
              />
              <PropertyEntry
                property="Max"
                value={state?.max}
                unit={state?.unit}
              />
            </>
          ) : null}
        </div>

        {/* <span className="border-b border-gray-300 mt-6 mb-2" /> */}
      </div>
    </div>
  );
}
