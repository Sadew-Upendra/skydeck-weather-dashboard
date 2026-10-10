import { Clock } from "lucide-react";
import Card from "../ui/Card";
import { describe } from "../../utils/weatherCodes";
import { nextHours } from "../../utils/format";

export default function HourlyForecast({ data, className = "" }) {
  const hours = nextHours(data);
  return (
    <Card title="Hourly forecast" icon={Clock} className={className}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {hours.map((h, i) => {
          const { Icon } = describe(h.code, h.isDay);
          return (
            <div
              key={h.time}
              className="flex min-w-16 flex-col items-center gap-1 rounded-2xl bg-slate-500/10 px-3 py-3"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400">{i === 0 ? "Now" : h.hour}</span>
              <Icon size={24} className="text-sky-500" />
              <span className="font-semibold">{h.temp}°</span>
              <span className="text-[11px] text-sky-500">{h.pop ?? 0}%</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}