import { Tooltip } from "@mantine/core";
import { ActionIcon, ActuatorAction } from "../../models/actuator";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";

export type ActuatorActionsProps = {
  isConnected: boolean;
  actions: ActuatorAction[];
  onActionClick: (action: ActuatorAction) => void;
};

export default function ActuatorActions({
  isConnected,
  actions,
  onActionClick,
}: ActuatorActionsProps) {
  const getIcon = (icon: ActionIcon) => {
    switch (icon) {
      case ActionIcon.play:
        return <IconPlayerPlay className="w-4 h-4 text-emerald-600" />;
      case ActionIcon.stop:
        return <IconPlayerStop className="w-4 h-4 text-red-700" />;
      default:
        return <IconPlayerPlay className="w-4 h-4" />;
    }
  };

  const items = actions?.map((a) => (
    <Tooltip label={a.description} key={a.key}>
      <button
        className="bg-gray-200 hover:bg-gray-300 disabled:hover:bg-gray-200 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        onClick={() => onActionClick(a)}
        disabled={!isConnected || !a.isAllowed}
      >
        {getIcon(a.icon)}
      </button>
    </Tooltip>
  ));

  return (
    <div className="flex flex-row gap-2 items-center justify-center min-h-8">
      {items}
    </div>
  );
}
