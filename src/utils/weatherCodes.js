import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog,
  CloudDrizzle, CloudRain, CloudSnow, CloudLightning,
} from "lucide-react";

export function describe(code, isDay = 1) {
  const day = !!isDay;
  if (code === 0) return { label: "Clear sky", Icon: day ? Sun : Moon, mood: day ? "day" : "night" };
  if (code <= 2) return { label: "Partly cloudy", Icon: day ? CloudSun : CloudMoon, mood: day ? "day" : "night" };
  if (code === 3) return { label: "Overcast", Icon: Cloud, mood: "cloudy" };
  if (code <= 48) return { label: "Foggy", Icon: CloudFog, mood: "cloudy" };
  if (code <= 57) return { label: "Drizzle", Icon: CloudDrizzle, mood: "rain" };
  if (code <= 67) return { label: "Rain", Icon: CloudRain, mood: "rain" };
  if (code <= 77) return { label: "Snow", Icon: CloudSnow, mood: "snow" };
  if (code <= 82) return { label: "Rain showers", Icon: CloudRain, mood: "rain" };
  if (code <= 86) return { label: "Snow showers", Icon: CloudSnow, mood: "snow" };
  return { label: "Thunderstorm", Icon: CloudLightning, mood: "storm" };
}

export const MOODS = {
  day: "from-sky-400 via-blue-500 to-indigo-600",
  night: "from-slate-900 via-indigo-950 to-slate-800",
  cloudy: "from-slate-500 via-slate-600 to-slate-800",
  rain: "from-slate-600 via-blue-800 to-slate-900",
  snow: "from-sky-300 via-slate-400 to-slate-600",
  storm: "from-gray-800 via-purple-900 to-slate-900",
};