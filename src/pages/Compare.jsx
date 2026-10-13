import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import {
  ArrowRight,
  CloudRain,
  Flame,
  GitCompare,
  Plus,
  Snowflake,
  Wind,
  X,
} from "lucide-react";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import SearchBar from "../components/layout/SearchBar";
import { fetchForecast } from "../api/weather";
import { useAppStore } from "../store/useAppStore";
import { describe } from "../utils/weatherCodes";

const MAX = 4;
const key = (c) => `${c.latitude.toFixed(2)},${c.longitude.toFixed(2)}`;

const SUGGESTED = [
  {
    name: "London",
    country: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    name: "New York",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.006,
  },
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  {
    name: "Sydney",
    country: "Australia",
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
  },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
];

const METRICS = [
  ["Feels like", (d) => `${Math.round(d.current.apparent_temperature)}°`],
  [
    "High / Low",
    (d) =>
      `${Math.round(d.daily.temperature_2m_max[0])}° / ${Math.round(d.daily.temperature_2m_min[0])}°`,
  ],
  ["Humidity", (d) => `${d.current.relative_humidity_2m}%`],
  [
    "Wind",
    (d) =>
      `${Math.round(d.current.wind_speed_10m)} ${d.current_units.wind_speed_10m}`,
  ],
  ["Rain chance", (d) => `${d.daily.precipitation_probability_max[0] ?? 0}%`],
  ["UV index", (d) => Math.round(d.daily.uv_index_max[0])],
];

const AWARDS = [
  {
    id: "warmest",
    label: "Warmest",
    icon: Flame,
    tone: "bg-orange-500/15 text-orange-800 dark:text-orange-300",
    value: (d) => d.current.temperature_2m,
    pick: "max",
  },
  {
    id: "coolest",
    label: "Coolest",
    icon: Snowflake,
    tone: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
    value: (d) => d.current.temperature_2m,
    pick: "min",
  },
  {
    id: "wettest",
    label: "Wettest",
    icon: CloudRain,
    tone: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-300",
    value: (d) => d.daily.precipitation_probability_max[0] ?? 0,
    pick: "max",
  },
  {
    id: "windiest",
    label: "Windiest",
    icon: Wind,
    tone: "bg-teal-500/15 text-teal-800 dark:text-teal-300",
    value: (d) => d.current.wind_speed_10m,
    pick: "max",
  },
];

function computeAwards(rows) {
  const wins = {};
  if (rows.length < 2) return wins;
  for (const a of AWARDS) {
    const vals = rows.map((r) => a.value(r.d));
    const best = a.pick === "max" ? Math.max(...vals) : Math.min(...vals);
    if (best === Math.min(...vals) && best === Math.max(...vals)) continue; // all equal
    const winner = rows[vals.indexOf(best)];
    (wins[key(winner.c)] ??= []).push(a);
  }
  return wins;
}

export default function Compare() {
  const { city, saved, unit, compare, setCompare, setCity } = useAppStore();
  const navigate = useNavigate();

  const list = compare.length ? compare : [city];
  const full = list.length >= MAX;

  const add = (c) => {
    if (list.length >= MAX || list.some((x) => key(x) === key(c))) return;
    setCompare([...list, c]);
  };
  const remove = (c) => setCompare(list.filter((x) => key(x) !== key(c)));

  const results = useQueries({
    queries: list.map((c) => ({
      queryKey: ["forecast", c.latitude, c.longitude, unit],
      queryFn: () => fetchForecast(c, unit),
      staleTime: 10 * 60 * 1000,
    })),
  });

  const rows = list
    .map((c, i) => ({ c, d: results[i].data }))
    .filter((r) => r.d);
  const wins = computeAwards(rows);

  const quick = [...saved, ...SUGGESTED]
    .filter(
      (c, i, arr) =>
        !list.some((x) => key(x) === key(c)) &&
        arr.findIndex((y) => key(y) === key(c)) === i,
    )
    .slice(0, 6);

  return (
    <div className="space-y-4">
      <Card title="Compare cities" icon={GitCompare} className="relative z-20">
        <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          Add up to {MAX} cities and see their weather side by side.
        </p>

        {full ? (
          <p className="rounded-xl bg-slate-500/10 px-3 py-2 text-sm">
            You're comparing {MAX} cities. Remove one to add another.
          </p>
        ) : (
          <SearchBar
            tone="solid"
            onSelect={add}
            placeholder="Add a city to compare…"
            label="Add a city to compare"
          />
        )}

        {!full && quick.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Quick add:
            </span>
            {quick.map((c) => (
              <button
                key={key(c)}
                onClick={() => add(c)}
                className="flex h-9 items-center gap-1 rounded-full bg-slate-500/10 px-3 text-sm transition hover:bg-slate-500/20"
              >
                <Plus size={14} aria-hidden /> {c.name}
              </button>
            ))}
          </div>
        )}

        {compare.length > 0 && (
          <button
            onClick={() => setCompare([])}
            className="mt-3 min-h-11 text-sm text-slate-600 underline underline-offset-2 dark:text-slate-400"
          >
            Clear comparison
          </button>
        )}
      </Card>

      {list.length === 1 && (
        <p className="px-1 text-sm text-white/90">
          Add at least one more city above to start comparing.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((c, i) => {
          const q = results[i];
          if (q.isError)
            return (
              <Card key={key(c)}>
                <p className="font-semibold">{c.name}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Couldn't load weather.
                </p>
                <button
                  onClick={() => q.refetch()}
                  className="mt-3 h-11 rounded-full bg-slate-500/10 px-5 text-sm"
                >
                  Retry
                </button>
              </Card>
            );
          if (!q.data) return <Skeleton key={key(c)} className="h-80" />;

          const d = q.data;
          const { Icon, label } = describe(
            d.current.weather_code,
            d.current.is_day,
          );
          return (
            <Card key={key(c)}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">{c.name}</h2>
                  <p className="truncate text-xs text-slate-600 dark:text-slate-400">
                    {c.country}
                  </p>
                </div>
                {list.length > 1 && (
                  <button
                    onClick={() => remove(c)}
                    aria-label={`Remove ${c.name}`}
                    className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-500/10"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="mt-1 flex min-h-6 flex-wrap gap-1.5">
                {(wins[key(c)] ?? []).map((a) => (
                  <span
                    key={a.id}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${a.tone}`}
                  >
                    <a.icon size={12} aria-hidden /> {a.label}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <Icon
                  size={44}
                  className="shrink-0 text-sky-600 dark:text-sky-400"
                  aria-hidden
                />
                <div>
                  <p className="text-5xl font-light leading-none">
                    {Math.round(d.current.temperature_2m)}°
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {label}
                  </p>
                </div>
              </div>

              <dl className="mt-4 divide-y divide-slate-500/10 text-sm">
                {METRICS.map(([name, fn]) => (
                  <div key={name} className="flex justify-between gap-2 py-2">
                    <dt className="text-slate-600 dark:text-slate-400">
                      {name}
                    </dt>
                    <dd className="font-medium">{fn(d)}</dd>
                  </div>
                ))}
              </dl>

              <button
                onClick={() => {
                  setCity(c);
                  navigate("/");
                }}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-500/10 text-sm font-medium transition hover:bg-slate-500/20"
              >
                Open dashboard <ArrowRight size={16} aria-hidden />
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
