import { IconDropletsFilled, IconInfoCircle, IconTemperature, IconWind } from "@tabler/icons-react";
import { SensorType } from "../../models/sensor";

export const getTypeIcon = (sensorType: SensorType, iconClass?: string) => {
  iconClass = iconClass ?? "w-4 h-4 text-emerald-500";
  switch (sensorType) {
    case SensorType.Temperature:
      return <IconTemperature className={iconClass} />;
    case SensorType.Humidity:
      return <IconWind className={iconClass} />;
    case SensorType.Moisture:
      return <IconDropletsFilled className={iconClass} />;
    default:
      return <IconInfoCircle className={iconClass} />;
  }
};

export const getTypeIconCircle = (
  sensorType: SensorType,
  iconClass?: string
) => {
  return (
    <div className="bg-emerald-100 rounded-full p-2">
      {getTypeIcon(sensorType, iconClass)}
    </div>
  );
};
