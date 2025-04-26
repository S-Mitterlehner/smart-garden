import { Badge, Button, Textarea, TextInput, Tooltip } from "@mantine/core";
import { SensorData, SensorRef } from "../../models/sensor";
import { useState } from "react";
import "./sensor.css";
import { getTypeIconCircle } from "./utils";
import { ConnectionState } from "../../models/general";
import { getTimeString } from "../../utils";
import { notifications } from "@mantine/notifications";

export default function SensorProperties({
  sensor,
  state,
  connectionState,
  onNotifyChanges = () => {},
}: {
  sensor: SensorRef;
  state: SensorData | null;
  connectionState: ConnectionState;
  onNotifyChanges?: () => void;
}) {
  const [name, setName] = useState(sensor.name);
  const [description, setDescription] = useState(sensor.description);
  const [hasChanges, setHasChanges] = useState(false);

  const saveChanges = () => {
    // TODO: make API call to save changes
    notifications.show({
      title: "TODO",
      message: `Action does not exist yet`,
      color: "purple",
    });
    onNotifyChanges();
    setHasChanges(false);
  };

  const getProperty = (
    property: string,
    value?: string | number,
    unit?: string
  ) => (
    <div className="flex flex-col">
      <span className="text-sm text-gray-400">{property}</span>
      <div className="flex flex-row gap-2 items-center min-h-[25px]">
        {value ? (
          <>
            <span className="text-gray-600">{value}</span>
            {unit && <span className="text-gray-400 line-clamp-1">{unit}</span>}
          </>
        ) : (
          <Badge color="gray" radius="sm" size="xs">
            N/A
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[auto_1fr_auto] gap-8 items-center">
          <Tooltip label={sensor.type} position="top" withArrow>
            {getTypeIconCircle(sensor.type, "w-10 h-10")}
          </Tooltip>

          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Device-Id</span>
            <span className="text-sm text-gray-600">{sensor.key}</span>
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
            className="sensor-input sensor-title"
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
            className="sensor-input sensor-description"
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
          {getProperty("Value", state?.currentValue, state?.unit)}
          {getProperty("Min", state?.min, state?.unit)}
          {getProperty("Max", state?.max, state?.unit)}
        </div>

        {/* <span className="border-b border-gray-300 mt-6 mb-2" /> */}
      </div>
    </div>
  );
}
