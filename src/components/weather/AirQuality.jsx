import { Leaf } from "lucide-react";
import Card from "../ui/Card";
import { aqiInfo } from "../../utils/format";

export default function AirQuality({ air, className = "" }) {
  const c = air?.current;
  if (!c || c.us_aqi == null) {
    return (
      <Card title="Air quality" icon={Leaf} className={className}>
        <p className="text-sm text-slate-500">Not available for this location.</p>
      </Card>
    );
  }
  const info = aqiInfo(c.us_aqi);
  return (
    <Card title="Air quality" icon={Leaf} className={className}>
      <p className="text-5xl font-semibold">{c.us_aqi}</p>
      <p className="mt-1 text-sm">{info.label}</p>
      <div className="mt-4 h-2 rounded-full bg-slate-500/20">
        <div className={`h-full rounded-full ${info.color}`} style={{ width: `${Math.min((c.us_aqi / 300) * 100, 100)}%` }} />
      </div>
      <div className="mt-4 flex justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>PM2.5: {c.pm2_5}</span>
        <span>PM10: {c.pm10}</span>
      </div>
    </Card>
  );
}