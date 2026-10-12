import { useEffect, useState } from "react";
import { ChevronRight, MapPin, RefreshCw, Star } from "lucide-react";
import { describe } from "../../utils/weatherCodes";
import { useAppStore } from "../../store/useAppStore";
import { LEVELS } from "../alerts/alertMeta";
import AlertIcon from "../alerts/AlertIcon";

function ago(ms) {
  const m = Math.floor(Math.max(0, ms) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  return `${Math.floor(m / 60)} h ago`;
}

function UpdatedLabel({ updatedAt }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  if (!updatedAt) return null;
  return <>Updated {ago(now - updatedAt)}</>;
}

export default function CurrentWeather({
  data,
  updatedAt,
  fetching,
  onRefresh,
  alert,
  alertCount = 0,
  onOpenAlerts,
  className = "",
}) {
  const { city, saved, toggleSaved } = useAppStore();
  const c = data.current;
  const d = data.daily;
  const { label, Icon } = describe(c.weather_code, c.is_day);
  const isSaved = saved.some(
    (x) => x.latitude === city.latitude && x.longitude === city.longitude,
  );

  const local = new Date(c.time);
  const dateText = local.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  const timeText = local.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const iconBtn =
    "grid h-11 w-11 place-items-center rounded-full transition hover:bg-white/15";

  return (
    <section
      className={`min-w-0 rounded-3xl bg-white/15 p-5 text-white shadow-xl ring-1 ring-white/20 backdrop-blur-xl sm:p-6 md:p-8 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="shrink-0" aria-hidden />
            <h1 className="truncate text-base font-medium sm:text-lg">
              {city.name}
              {city.country && (
                <span className="text-white/90">, {city.country}</span>
              )}
            </h1>
          </div>
          <p className="mt-1 pl-7 text-xs text-white/90 sm:text-sm">
            {dateText} · {timeText}
          </p>
          <p className="pl-7 text-xs text-white/80">
            <UpdatedLabel updatedAt={updatedAt} />
          </p>
        </div>

        <div className="-mr-2 -mt-2 flex shrink-0">
          <button
            onClick={onRefresh}
            disabled={fetching}
            aria-label="Refresh weather"
            className={`${iconBtn} disabled:opacity-70`}
          >
            <RefreshCw size={18} className={fetching ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => toggleSaved(city)}
            aria-label={isSaved ? "Remove city from saved" : "Save city"}
            aria-pressed={isSaved}
            className={iconBtn}
          >
            <Star
              size={22}
              className={isSaved ? "fill-yellow-300 text-yellow-300" : ""}
            />
          </button>
        </div>
      </div>
      <span className="sr-only" role="status">
        {fetching ? "Refreshing weather" : ""}
      </span>

      <div className="mt-4 flex items-center justify-between gap-3 sm:mt-6">
        <div className="min-w-0">
          <p className="text-6xl font-light leading-none sm:text-7xl md:text-8xl">
            {Math.round(c.temperature_2m)}°
          </p>
          <p className="mt-3 text-lg sm:text-xl">{label}</p>
          <p className="text-sm text-white/90">
            Feels like {Math.round(c.apparent_temperature)}° · H{" "}
            {Math.round(d.temperature_2m_max[0])}° · L{" "}
            {Math.round(d.temperature_2m_min[0])}°
          </p>
        </div>
        <Icon
          className="h-20 w-20 shrink-0 sm:h-28 sm:w-28 md:h-36 md:w-36"
          strokeWidth={1.2}
          aria-hidden
        />
      </div>

      {alert && (
        <button
          onClick={onOpenAlerts}
          aria-haspopup="dialog"
          className={`mt-5 flex max-w-full items-center gap-2 rounded-full py-1.5 pl-2 pr-2 text-sm font-medium shadow-md transition hover:brightness-110 ${LEVELS[alert.level].solid}`}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/20">
            <AlertIcon alert={alert} size={16} aria-hidden />
          </span>
          <span className="truncate">{alert.title}</span>
          {alertCount > 1 && (
            <span className="shrink-0 rounded-full bg-white/25 px-2 text-xs">
              +{alertCount - 1}
            </span>
          )}
          <ChevronRight size={16} className="shrink-0" aria-hidden />
        </button>
      )}
    </section>
  );
}
