import { IconEngine, IconInfoCircle } from "@tabler/icons-react";
import { ActuatorType } from "../../models/actuator";

export const getTypeIcon = (actuatorType: ActuatorType, iconClass?: string) => {
  iconClass = iconClass ?? "w-4 h-4 text-emerald-500";
  switch (actuatorType) {
    case ActuatorType.Pump:
      return <IconEngine className={iconClass} />;
    default:
      return <IconInfoCircle className={iconClass} />;
  }
};

export const getTypeIconCircle = (
  ActuatorType: ActuatorType,
  iconClass?: string
) => {
  return (
    <div className="bg-emerald-100 rounded-full p-2">
      {getTypeIcon(ActuatorType, iconClass)}
    </div>
  );
};
