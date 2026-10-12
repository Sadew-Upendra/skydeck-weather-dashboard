import {
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Leaf,
  Sun,
  ThermometerSnowflake,
  ThermometerSun,
  Umbrella,
  Wind,
} from "lucide-react";

export const ICONS = {
  storm: CloudLightning,
  rain: CloudRain,
  snow: CloudSnow,
  fog: CloudFog,
  heat: ThermometerSun,
  cold: ThermometerSnowflake,
  wind: Wind,
  umbrella: Umbrella,
  humidity: Droplets,
  uv: Sun,
  air: Leaf,
};

export const LEVELS = {
  danger: {
    label: "Danger",
    accent: "border-l-red-600",
    chip: "bg-red-500/15 text-red-700 dark:text-red-300",
    solid: "bg-red-700 text-white",
    bar: "bg-red-600",
  },
  warning: {
    label: "Warning",
    accent: "border-l-amber-500",
    chip: "bg-amber-500/20 text-amber-800 dark:text-amber-300",
    solid: "bg-amber-700 text-white",
    bar: "bg-amber-500",
  },
  info: {
    label: "Advisory",
    accent: "border-l-sky-500",
    chip: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
    solid: "bg-sky-700 text-white",
    bar: "bg-sky-500",
  },
};

// Alerts about current conditions vs. the whole day's forecast
export const NOW_IDS = ["fog", "heat", "humid", "cold", "wind", "air"];

export const alertKey = (scope, alert) => `${scope}:${alert.id}`;
