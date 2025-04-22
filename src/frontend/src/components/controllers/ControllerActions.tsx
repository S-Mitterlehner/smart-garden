import { Tooltip } from "@mantine/core";
import { ActionIcon, ControllerAction } from "../../models/controller";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";

export type ControllerActionsProps = {
  isConnected: boolean;
  actions: ControllerAction[];
  onActionClick: (action: ControllerAction) => void;
};

export default function ControllerActions({
  isConnected,
  actions,
  onActionClick,
}: ControllerActionsProps) {
  const getIcon = (icon: ActionIcon) => {
    switch (icon) {
      case ActionIcon.play:
        return <IconPlayerPlay className="w-4 h-4 text-emerald-600" />;
      case ActionIcon.stop:
        return <IconPlayerStop className="w-4 h-4 text-red-700" />;
      default:
        return null;
    }
  };

  const items = actions?.map((a) => (
    <Tooltip label={a.description} key={a.id}>
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
