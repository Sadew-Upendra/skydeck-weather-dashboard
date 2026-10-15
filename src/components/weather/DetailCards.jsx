import { Cloud, Droplets, Eye, Gauge, Sun, Wind } from "lucide-react";
import Card from "../ui/Card";
import { compass, uvInfo } from "../../utils/format";

function visibility(meters, unit) {
  if (meters == null) return { value: "–" };
  const km = meters / 1000;
  const sub = km >= 10 ? "Clear" : km >= 4 ? "Fair" : km >= 1 ? "Poor" : "Very poor";
  if (unit === "F") return { value: `${(meters / 1609.34).toFixed(1)} mi`, sub };
  return { value: `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`, sub };
}

const cloudLabel = (p) => (p < 20 ? "Mostly clear" : p < 60 ? "Partly cloudy" : p < 90 ? "Mostly cloudy" : "Overcast");

export default function DetailCards({ data, unit = "C", className = "" }) {
  const c = data.current;
  const uv = data.daily.uv_index_max[0];
  const vis = visibility(c.visibility, unit);

  const items = [
    { label: "Wind", icon: Wind, value: `${Math.round(c.wind_speed_10m)} ${data.current_units.wind_speed_10m}`, sub: compass(c.wind_direction_10m) },
    { label: "Humidity", icon: Droplets, value: `${c.relative_humidity_2m}%` },
    { label: "UV index", icon: Sun, value: Math.round(uv), sub: uvInfo(uv) },
    { label: "Pressure", icon: Gauge, value: `${Math.round(c.pressure_msl)} hPa` },
    { label: "Visibility", icon: Eye, value: vis.value, sub: vis.sub },
    { label: "Cloud cover", icon: Cloud, value: c.cloud_cover == null ? "–" : `${c.cloud_cover}%`, sub: c.cloud_cover == null ? undefined : cloudLabel(c.cloud_cover) },
  ];

  return (
    <div className={`grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 ${className}`}>
      {items.map(({ label, icon, value, sub }) => (
        <Card key={label} title={label} icon={icon}>
          <p className="break-words text-xl font-semibold sm:text-2xl">{value}</p>
          {sub && <p className="text-xs text-slate-600 dark:text-slate-400">{sub}</p>}
        </Card>
      ))}
    </div>
  );
}