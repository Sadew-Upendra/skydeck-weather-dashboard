import { Clock } from "lucide-react";
import Card from "../ui/Card";
import { describe } from "../../utils/weatherCodes";
import { nextHours } from "../../utils/format";

export default function HourlyForecast({ data, className = "" }) {
  const hours = nextHours(data);
  return (
    <Card title="Hourly forecast" icon={Clock} className={className}>
      <ul className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 sm:gap-3">
        {hours.map((h, i) => {
          const { Icon } = describe(h.code, h.isDay);
          return (
            <li
              key={h.time}
              className="flex min-w-[4.25rem] shrink-0 snap-start flex-col items-center gap-1 rounded-2xl bg-slate-500/10 px-2 py-3"
            >
              <span className="text-xs text-slate-600 dark:text-slate-400">{i === 0 ? "Now" : h.hour}</span>
              <Icon size={24} className="text-sky-600 dark:text-sky-400" />
              <span className="font-semibold">{h.temp}°</span>
              <span className="text-xs text-sky-700 dark:text-sky-300">{h.pop ?? 0}%</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}