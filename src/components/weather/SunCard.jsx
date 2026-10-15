import { Sunrise, Sunset } from "lucide-react";
import Card from "../ui/Card";
import { getSunInfo } from "../../utils/sun";
import { timeLabel } from "../../utils/format";

export default function SunCard({ data, className = "" }) {
  const s = getSunInfo(data);
  const pct = Math.round(s.progress * 100);
  const label =
    "flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400";

  return (
    <Card className={className}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className={label}>
            <Sunrise size={14} className="text-amber-500" aria-hidden /> Sunrise
          </p>
          <p className="text-lg font-semibold leading-tight">
            {timeLabel(s.sunrise)}
          </p>
        </div>

        <p className="pb-0.5 text-center text-xs text-slate-600 dark:text-slate-400">
          {s.status}
        </p>

        <div className="text-right">
          <p className={`${label} justify-end`}>
            <Sunset size={14} className="text-orange-500" aria-hidden /> Sunset
          </p>
          <p className="text-lg font-semibold leading-tight">
            {timeLabel(s.sunset)}
          </p>
        </div>
      </div>

      <div
        role="img"
        aria-label={`${s.status}. ${s.daylight} of daylight today.`}
        className="relative mx-2 mt-4 h-4"
      >
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-500/20" />
        <div
          className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-linear-to-r from-amber-300 to-orange-400"
          style={{ width: `${pct}%` }}
        />
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ${
            s.isUp ? "bg-amber-400" : "bg-slate-400"
          }`}
          style={{ left: `${pct}%` }}
        />
      </div>
    </Card>
  );
}
