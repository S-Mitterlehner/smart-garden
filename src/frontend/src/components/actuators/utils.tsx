import { IconCircuitSwitchOpen, IconEngine, IconInfoCircle } from "@tabler/icons-react";
import { ModuleType } from "../../__generated__/graphql";

export const getTypeIcon = (moduleType: ModuleType, iconClass?: string) => {
  iconClass = iconClass ?? "w-4 h-4 text-emerald-500";
  switch (moduleType) {
    case ModuleType.Pump:
      return <IconEngine className={iconClass} />;
    case ModuleType.Hatch:
      return <IconCircuitSwitchOpen className={iconClass} />;
    default:
      return <IconInfoCircle className={iconClass} />;
  }
};

export const getTypeIconCircle = (moduleType: ModuleType, iconClass?: string) => {
  return <div className="rounded-full bg-emerald-100 p-2">{getTypeIcon(moduleType, iconClass)}</div>;
};
