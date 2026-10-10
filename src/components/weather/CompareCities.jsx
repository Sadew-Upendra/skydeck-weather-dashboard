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
        <p className="text-sm text-slate-500">
          Save at least one more city with the ⭐ on the dashboard to compare.
        </p>
      </Card>
    );
  }

  const select = (value, onChange) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl bg-slate-500/10 px-3 py-2 text-sm outline-none"
    >
      {options.map((c) => (
        <option key={key(c)} value={key(c)}>{c.name}</option>
      ))}
    </select>
  );

  return (
    <Card title="Compare cities" icon={GitCompare}>
      <div className="grid grid-cols-[6rem_1fr_1fr] items-center gap-x-3 sm:grid-cols-[9rem_1fr_1fr]">
        <span />
        {select(aKey, setAKey)}
        {select(bKey, setBKey)}

        <span />
        {results.map((r, i) => {
          if (!r.data) return <div key={i} className="py-6 text-center text-sm text-slate-500">Loading…</div>;
          const { Icon, label } = describe(r.data.current.weather_code, r.data.current.is_day);
          return (
            <div key={i} className="flex flex-col items-center py-4">
              <Icon size={40} className="text-sky-500" />
              <span className="text-sm">{label}</span>
            </div>
          );
        })}

        {ROWS.map(([label, fn]) => (
          <Fragment key={label}>
            <span className="border-t border-slate-500/10 py-3 text-sm text-slate-500">{label}</span>
            {results.map((r, i) => (
              <span key={i} className="border-t border-slate-500/10 py-3 text-center text-lg font-semibold">
                {r.data ? fn(r.data) : "–"}
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </Card>
  );
}