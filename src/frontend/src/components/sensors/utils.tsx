import {
  IconCircuitSwitchOpen,
  IconDropletsFilled,
  IconEngine,
  IconInfoCircle,
  IconPlayerPlay,
  IconPlayerStop,
  IconStopwatch,
  IconTemperature,
  IconWind,
} from "@tabler/icons-react";
import { cva, VariantProps } from "class-variance-authority";
import { ActionIcons, ModuleType } from "../../__generated__/graphql";

const iconVariants = cva("", {
  variants: {
    size: {
      default: "w-4 h-4",
      xl: "w-6 h-6",
    },
    color: {
      default: "text-emerald-500",
      orange: "text-orange-500",
      red: "text-red-500",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

const circleVariants = cva("rounded-full", {
  variants: {
    size: {
      default: "p-2",
      xl: "p-3",
    },
    color: {
      default: "bg-emerald-100",
      orange: "bg-orange-100",
      red: "bg-red-100",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

export const getTypeIcon = (moduleType: ModuleType, variants?: VariantProps<typeof iconVariants>) => {
  const iconClass = iconVariants(variants);
  switch (moduleType) {
    case ModuleType.Temperature:
      return <IconTemperature className={iconClass} />;
    case ModuleType.Humidity:
      return <IconWind className={iconClass} />;
    case ModuleType.Moisture:
      return <IconDropletsFilled className={iconClass} />;
    case ModuleType.Pump:
      return <IconEngine className={iconClass} />;
    case ModuleType.Hatch:
      return <IconCircuitSwitchOpen className={iconClass} />;
    default:
      return <IconInfoCircle className={iconClass} />;
  }
};

export const getTypeIconCircle = (moduleType: ModuleType, variants?: VariantProps<typeof circleVariants>) => {
  const mergedCircleClass = circleVariants(variants);
  return <div className={mergedCircleClass}>{getTypeIcon(moduleType, variants)}</div>;
};

export const getActionIcon = (icon: ActionIcons) => {
  switch (icon) {
    case ActionIcons.Play:
      return <IconPlayerPlay className="h-4 w-4 text-emerald-600" />;
    case ActionIcons.Stop:
      return <IconPlayerStop className="h-4 w-4 text-red-700" />;
    case ActionIcons.Timer:
      return <IconStopwatch className="h-4 w-4 text-yellow-500" />;
    default:
      return <IconPlayerPlay className="h-4 w-4" />;
  }
};