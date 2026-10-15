import { Leaf } from "lucide-react";
import Card from "../ui/Card";
import { aqiInfo } from "../../utils/format";

const POLLUTANTS = [
  ["PM2.5", "pm2_5"],
  ["PM10", "pm10"],
  ["Ozone", "ozone"],
  ["NO₂", "nitrogen_dioxide"],
];

export default function AirQuality({ air, className = "" }) {
  const c = air?.current;
  if (!c || c.us_aqi == null) {
    return (
      <Card title="Air quality" icon={Leaf} className={className}>
        <p className="text-sm text-slate-600 dark:text-slate-400">Not available for this location.</p>
      </Card>
    );
  }
  const info = aqiInfo(c.us_aqi);
  return (
    <Card title="Air quality" icon={Leaf} className={className}>
      <div className="flex items-end justify-between gap-3">
        <p className="text-5xl font-semibold leading-none">{c.us_aqi}</p>
        <p className="pb-1 text-right text-sm font-medium">{info.label}</p>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-500/20">
        <div
          className={`h-full rounded-full ${info.color}`}
          style={{ width: `${Math.min((c.us_aqi / 300) * 100, 100)}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{info.advice}</p>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        {POLLUTANTS.map(([name, key]) => (
          <div key={key} className="rounded-xl bg-slate-500/10 px-3 py-2">
            <dt className="text-xs text-slate-600 dark:text-slate-400">{name}</dt>
            <dd className="font-semibold">
              {c[key] == null ? "–" : Math.round(c[key])}
              <span className="ml-1 text-xs font-normal text-slate-600 dark:text-slate-400">µg/m³</span>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}