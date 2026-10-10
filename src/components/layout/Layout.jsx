import { Suspense, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { useWeather } from "../../hooks/useWeather";
import { describe, MOODS } from "../../utils/weatherCodes";
import { hideSplash } from "../../utils/splash";
import Header from "./Header";
import SavedCities from "./SavedCities";
import PageLoader from "../ui/PageLoader";
import TopLoader from "../ui/TopLoader";
import WeatherBackground from "../ui/WeatherBackground";
import ErrorBoundary from "../ErrorBoundary";

const tabs = [
  ["/", "Dashboard"],
  ["/compare", "Compare"],
  ["/trends", "Trends"],
];

export default function Layout() {
  const { city, unit, theme } = useAppStore();
  const { weather } = useWeather(city, unit);
  const { pathname } = useLocation();
  const data = weather.data;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (weather.isPending) return;
    const t = setTimeout(hideSplash, Math.max(0, 900 - performance.now()));
    return () => clearTimeout(t);
  }, [weather.isPending]);

  const mood = data ? describe(data.current.weather_code, data.current.is_day).mood : "night";

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <TopLoader />
      <div
        aria-hidden
        className={`fixed inset-0 -z-10 bg-linear-to-br ${MOODS[mood]} transition-colors duration-700`}
      />
      <WeatherBackground mood={mood} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900"
      >
        Skip to content
      </a>

      <div className="safe-pad relative z-10 mx-auto max-w-7xl space-y-4">
        <Header />
        <SavedCities />

        <nav aria-label="Main" className="no-scrollbar flex gap-2 overflow-x-auto">
          {tabs.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex h-10 shrink-0 items-center rounded-full px-5 text-sm backdrop-blur transition ${
                  isActive ? "bg-white text-slate-900" : "bg-white/20 text-white hover:bg-white/30"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <main id="main" tabIndex={-1} className="space-y-4 outline-none">
          <ErrorBoundary key={pathname} name="This page">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>

        <footer className="py-4 text-center text-xs text-white/90">
          Weather data by{" "}
          <a className="underline" href="https://open-meteo.com" target="_blank" rel="noreferrer">
            Open-Meteo.com
          </a>{" "}
          (CC BY 4.0)
        </footer>
      </div>
    </div>
  );
}