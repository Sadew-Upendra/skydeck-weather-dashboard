import { Fragment, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { GitCompare } from "lucide-react";
import Card from "../ui/Card";
import { fetchForecast } from "../../api/weather";
import { useAppStore } from "../../store/useAppStore";
import { describe } from "../../utils/weatherCodes";

const key = (c) => `${c.latitude},${c.longitude}`;

const ROWS = [
  ["Temperature", (d) => `${Math.round(d.current.temperature_2m)}°`],
  ["Feels like", (d) => `${Math.round(d.current.apparent_temperature)}°`],
  ["High / Low", (d) => `${Math.round(d.daily.temperature_2m_max[0])}° / ${Math.round(d.daily.temperature_2m_min[0])}°`],
  ["Humidity", (d) => `${d.current.relative_humidity_2m}%`],
  ["Wind", (d) => `${Math.round(d.current.wind_speed_10m)} ${d.current_units.wind_speed_10m}`],
  ["Rain chance", (d) => `${d.daily.precipitation_probability_max[0] ?? 0}%`],
  ["UV index", (d) => Math.round(d.daily.uv_index_max[0])],
];

export default function CompareCities() {
  const { city, saved, unit } = useAppStore();
  const options = [city, ...saved.filter((c) => key(c) !== key(city))];
  const [aKey, setAKey] = useState(key(options[0]));
  const [bKey, setBKey] = useState(options[1] ? key(options[1]) : "");

  const picks = [aKey, bKey].map((k) => options.find((c) => key(c) === k) ?? null);
  const results = useQueries({
    queries: picks.map((p) => ({
      queryKey: ["forecast", p?.latitude, p?.longitude, unit],
      queryFn: () => fetchForecast(p, unit),
      enabled: !!p,
      staleTime: 10 * 60 * 1000,
    })),
  });

  if (options.length < 2) {
    return (
      <Card title="Compare cities" icon={GitCompare}>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Save at least one more city with the ⭐ on the dashboard to compare.
        </p>
      </Card>
    );
  }

  const select = (label, value, onChange) => (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full min-w-0 rounded-xl bg-slate-500/10 px-2 text-base outline-none sm:px-3 sm:text-sm"
    >
      {options.map((c) => (
        <option key={key(c)} value={key(c)}>{c.name}</option>
      ))}
    </select>
  );

  return (
    <Card title="Compare cities" icon={GitCompare}>
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-3">
        <span />
        {select("First city", aKey, setAKey)}
        {select("Second city", bKey, setBKey)}

        <span />
        {results.map((r, i) => {
          if (!r.data) return <div key={i} className="py-6 text-center text-sm text-slate-600">Loading…</div>;
          const { Icon, label } = describe(r.data.current.weather_code, r.data.current.is_day);
          return (
            <div key={i} className="flex min-w-0 flex-col items-center py-4 text-center">
              <Icon size={36} className="text-sky-600 dark:text-sky-400" aria-hidden />
              <span className="text-xs sm:text-sm">{label}</span>
            </div>
          );
        })}

        {ROWS.map(([label, fn]) => (
          <Fragment key={label}>
            <span className="border-t border-slate-500/10 py-3 text-xs text-slate-600 sm:text-sm dark:text-slate-400">{label}</span>
            {results.map((r, i) => (
              <span key={i} className="min-w-0 border-t border-slate-500/10 py-3 text-center text-base font-semibold sm:text-lg">
                {r.data ? fn(r.data) : "–"}
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </Card>
  );
}