import { lazy, Suspense } from "react";
import { useAppStore } from "../store/useAppStore";
import { useWeather } from "../hooks/useWeather";
import { getAlerts } from "../utils/alerts";
import ErrorBoundary from "../components/ErrorBoundary";
import Skeleton from "../components/ui/Skeleton";
import AlertBanner from "../components/weather/AlertBanner";
import CurrentWeather from "../components/weather/CurrentWeather";
import HourlyForecast from "../components/weather/HourlyForecast";
import DailyForecast from "../components/weather/DailyForecast";
import AirQuality from "../components/weather/AirQuality";
import DetailCards from "../components/weather/DetailCards";

const RadarMap = lazy(() => import("../components/map/RadarMap"));
const TempChart = lazy(() => import("../components/charts/TempChart"));

export default function Dashboard() {
  const { city, unit } = useAppStore();
  const { weather, air } = useWeather(city, unit);
  const data = weather.data;

  if (weather.isError) {
    return (
      <div role="alert" className="rounded-2xl bg-red-600 p-4 text-white">
        Couldn't load weather. {weather.error.message}{" "}
        <button className="ml-1 h-11 underline" onClick={() => weather.refetch()}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64 lg:row-span-2" />
        <Skeleton className="h-40 lg:col-span-2" />
      </div>
    );
  }

  return (
    <>
      <AlertBanner alerts={getAlerts(data, air.data, unit)} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CurrentWeather data={data} className="md:col-span-2" />
        <HourlyForecast data={data} className="md:col-span-2" />
        <ErrorBoundary name="Chart" className="md:col-span-2">
          <Suspense fallback={<Skeleton className="h-64 md:col-span-2" />}>
            <TempChart data={data} className="md:col-span-2" />
          </Suspense>
        </ErrorBoundary>
        <DailyForecast data={data} className="lg:col-start-3 lg:row-span-2 lg:row-start-1" />
        <AirQuality air={air.data} />
        <DetailCards data={data} className="md:col-span-2 lg:col-span-3" />
        <ErrorBoundary name="Radar" className="md:col-span-2 lg:col-span-3">
          <Suspense fallback={<Skeleton className="h-80 md:col-span-2 lg:col-span-3" />}>
            <RadarMap city={city} className="md:col-span-2 lg:col-span-3" />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}