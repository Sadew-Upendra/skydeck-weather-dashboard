import { useEffect, useState } from "react";
import { useAppStore } from "./store/useAppStore";
import { useWeather } from "./hooks/useWeather";
import { describe, MOODS } from "./utils/weatherCodes";
import { getAlerts } from "./utils/alerts";
import Header from "./components/layout/Header";
import SavedCities from "./components/layout/SavedCities";
import Skeleton from "./components/ui/Skeleton";
import WeatherBackground from "./components/ui/WeatherBackground";
import AlertBanner from "./components/weather/AlertBanner";
import CurrentWeather from "./components/weather/CurrentWeather";
import DailyForecast from "./components/weather/DailyForecast";
import HourlyForecast from "./components/weather/HourlyForecast";
import DetailCards from "./components/weather/DetailCards";
import AirQuality from "./components/weather/AirQuality";
import CompareCities from "./components/weather/CompareCities";
import TempChart from "./components/charts/TempChart";
import RadarMap from "./components/map/RadarMap";

export default function App() {
  const { city, unit, theme } = useAppStore();
  const { weather, air } = useWeather(city, unit);
  const [view, setView] = useState("dashboard");
  const data = weather.data;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const mood = data
    ? describe(data.current.weather_code, data.current.is_day).mood
    : "night";

  return (
    <div
      className={`min-h-screen bg-linear-to-br ${MOODS[mood]} transition-colors duration-700`}
    >
      <WeatherBackground mood={mood} />
      <div className="relative z-10 mx-auto max-w-7xl space-y-4 p-4 md:p-6">
        <Header />
        <SavedCities />

        <nav className="flex gap-2">
          {["dashboard", "compare"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 text-sm capitalize backdrop-blur transition ${
                view === v
                  ? "bg-white text-slate-900"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {v}
            </button>
          ))}
        </nav>

        {view === "compare" ? (
          <CompareCities />
        ) : (
          <>
            {weather.isError && (
              <div className="rounded-2xl bg-red-500/20 p-4 text-white">
                Couldn't load weather. {weather.error.message}{" "}
                <button className="underline" onClick={() => weather.refetch()}>
                  Retry
                </button>
              </div>
            )}

            {weather.isLoading && (
              <div className="grid gap-4 lg:grid-cols-3">
                <Skeleton className="h-64 lg:col-span-2" />
                <Skeleton className="h-64 lg:row-span-2" />
                <Skeleton className="h-40 lg:col-span-2" />
              </div>
            )}

            {data && (
              <>
                <AlertBanner alerts={getAlerts(data, air.data, unit)} />
                <div className="grid gap-4 lg:grid-cols-3">
                  <CurrentWeather data={data} className="lg:col-span-2" />
                  <DailyForecast data={data} className="lg:row-span-2" />
                  <HourlyForecast data={data} className="lg:col-span-2" />
                  <TempChart data={data} className="lg:col-span-2" />
                  <AirQuality air={air.data} />
                  <DetailCards data={data} className="lg:col-span-3" />
                  <RadarMap city={city} className="lg:col-span-3" />
                </div>
              </>
            )}
          </>
        )}

        <footer className="py-4 text-center text-xs text-white/70">
          Weather data by{" "}
          <a
            className="underline"
            href="https://open-meteo.com"
            target="_blank"
            rel="noreferrer"
          >
            Open-Meteo.com
          </a>{" "}
          (CC BY 4.0)
        </footer>
      </div>
    </div>
  );
}
