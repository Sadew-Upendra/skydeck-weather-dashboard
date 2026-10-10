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
      className={`rounded-3xl bg-white/15 p-6 text-white shadow-xl ring-1 ring-white/20 backdrop-blur-xl md:p-8 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={18} />
          <h1 className="text-lg font-medium">
            {city.name}
            {city.country && <span className="text-white/70">, {city.country}</span>}
          </h1>
        </div>
        <button onClick={() => toggleSaved(city)} aria-label="Save city">
          <Star size={22} className={isSaved ? "fill-yellow-300 text-yellow-300" : ""} />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-7xl font-light leading-none md:text-8xl">{Math.round(c.temperature_2m)}°</p>
          <p className="mt-3 text-xl">{label}</p>
          <p className="text-sm text-white/80">
            Feels like {Math.round(c.apparent_temperature)}° · H {Math.round(d.temperature_2m_max[0])}° · L{" "}
            {Math.round(d.temperature_2m_min[0])}°
          </p>
        </div>
        <Icon className="h-24 w-24 shrink-0 md:h-36 md:w-36" strokeWidth={1.2} />
      </div>
    </section>
  );
}