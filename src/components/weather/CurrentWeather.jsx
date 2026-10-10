import { MapPin, Star } from "lucide-react";
import { describe } from "../../utils/weatherCodes";
import { useAppStore } from "../../store/useAppStore";

export default function CurrentWeather({ data, className = "" }) {
  const { city, saved, toggleSaved } = useAppStore();
  const c = data.current;
  const d = data.daily;
  const { label, Icon } = describe(c.weather_code, c.is_day);
  const isSaved = saved.some((x) => x.latitude === city.latitude && x.longitude === city.longitude);

  return (
    <section
      className={`min-w-0 rounded-3xl bg-white/15 p-5 text-white shadow-xl ring-1 ring-white/20 backdrop-blur-xl sm:p-6 md:p-8 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin size={18} className="shrink-0" aria-hidden />
          <h1 className="truncate text-base font-medium sm:text-lg">
            {city.name}
            {city.country && <span className="text-white/90">, {city.country}</span>}
          </h1>
        </div>
        <button
          onClick={() => toggleSaved(city)}
          aria-label={isSaved ? "Remove city from saved" : "Save city"}
          aria-pressed={isSaved}
          className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full"
        >
          <Star size={22} className={isSaved ? "fill-yellow-300 text-yellow-300" : ""} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 sm:mt-6">
        <div className="min-w-0">
          <p className="text-6xl font-light leading-none sm:text-7xl md:text-8xl">
            {Math.round(c.temperature_2m)}°
          </p>
          <p className="mt-3 text-lg sm:text-xl">{label}</p>
          <p className="text-sm text-white/90">
            Feels like {Math.round(c.apparent_temperature)}° · H {Math.round(d.temperature_2m_max[0])}° · L{" "}
            {Math.round(d.temperature_2m_min[0])}°
          </p>
        </div>
        <Icon className="h-20 w-20 shrink-0 sm:h-28 sm:w-28 md:h-36 md:w-36" strokeWidth={1.2} aria-hidden />
      </div>
    </section>
  );
}