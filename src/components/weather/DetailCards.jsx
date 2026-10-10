import { Droplets, Gauge, Sun, Sunrise, Sunset, Wind } from "lucide-react";
import Card from "../ui/Card";
import { compass, timeLabel, uvInfo } from "../../utils/format";

export default function DetailCards({ data, className = "" }) {
  const c = data.current;
  const d = data.daily;
  const uv = d.uv_index_max[0];
  const items = [
    { label: "Wind", icon: Wind, value: `${Math.round(c.wind_speed_10m)} ${data.current_units.wind_speed_10m}`, sub: compass(c.wind_direction_10m) },
    { label: "Humidity", icon: Droplets, value: `${c.relative_humidity_2m}%` },
    { label: "UV index", icon: Sun, value: Math.round(uv), sub: uvInfo(uv) },
    { label: "Pressure", icon: Gauge, value: `${Math.round(c.pressure_msl)} hPa` },
    { label: "Sunrise", icon: Sunrise, value: timeLabel(d.sunrise[0]) },
    { label: "Sunset", icon: Sunset, value: timeLabel(d.sunset[0]) },
  ];
  return (
    <div className={`grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 ${className}`}>
      {items.map(({ label, icon, value, sub }) => (
        <Card key={label} title={label} icon={icon}>
          <p className="text-2xl font-semibold">{value}</p>
          {sub && <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
        </Card>
      ))}
    </div>
  );
}