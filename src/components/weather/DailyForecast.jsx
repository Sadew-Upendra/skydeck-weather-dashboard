import { CalendarDays } from "lucide-react";
import Card from "../ui/Card";
import { describe } from "../../utils/weatherCodes";
import { dayLabel } from "../../utils/format";

export default function DailyForecast({ data, className = "" }) {
  const d = data.daily;
  const lo = Math.min(...d.temperature_2m_min);
  const hi = Math.max(...d.temperature_2m_max);
  const span = hi - lo || 1;

  return (
    <Card title="7-day forecast" icon={CalendarDays} className={className}>
      <ul className="divide-y divide-slate-500/10">
        {d.time.map((day, i) => {
          const { Icon, label } = describe(d.weather_code[i]);
          const min = d.temperature_2m_min[i];
          const max = d.temperature_2m_max[i];
          return (
            <li key={day} className="flex items-center gap-2 py-3 text-sm sm:gap-3">
              <span className="w-11 shrink-0 font-medium sm:w-12">{dayLabel(day, i)}</span>
              <Icon size={22} className="shrink-0 text-sky-600 dark:text-sky-400" aria-label={label} />
              <span className="hidden w-9 shrink-0 text-xs text-sky-700 min-[400px]:block dark:text-sky-300">
                {d.precipitation_probability_max[i] ?? 0}%
              </span>
              <span className="w-8 shrink-0 text-right text-slate-600 dark:text-slate-400">{Math.round(min)}°</span>
              <div className="relative h-1.5 min-w-8 flex-1 rounded-full bg-slate-500/20">
                <div
                  className="absolute h-full rounded-full bg-linear-to-r from-sky-400 to-orange-400"
                  style={{
                    left: `${((min - lo) / span) * 100}%`,
                    width: `${Math.max(((max - min) / span) * 100, 8)}%`,
                  }}
                />
              </div>
              <span className="w-8 shrink-0">{Math.round(max)}°</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}