import { lazy, Suspense } from "react";
import { useAppStore } from "../store/useAppStore";
import { useWeather } from "../hooks/useWeather";
import { useAlerts } from "../hooks/useAlerts";
import { useAlertStore } from "../store/useAlertStore";
import ErrorBoundary from "../components/ErrorBoundary";
import Skeleton from "../components/ui/Skeleton";
import CurrentWeather from "../components/weather/CurrentWeather";
import HourlyForecast from "../components/weather/HourlyForecast";
import DailyForecast from "../components/weather/DailyForecast";
import AirQuality from "../components/weather/AirQuality";
import DetailCards from "../components/weather/DetailCards";
import InsightsCard from "../components/weather/InsightsCard";
import SunCard from "../components/weather/SunCard";

const RadarMap = lazy(() => import("../components/map/RadarMap"));
const TempChart = lazy(() => import("../components/charts/TempChart"));

export default function Dashboard() {
  const { city, unit } = useAppStore();
  const { weather, air } = useWeather(city, unit);
  const { alerts } = useAlerts();
  const openPanel = useAlertStore((s) => s.openPanel);
  const data = weather.data;

  if (weather.isError) {
    return (
      <div role="alert" className="rounded-2xl bg-red-600 p-4 text-white">
        Couldn't load weather. {weather.error.message}{" "}
        <button
          className="ml-1 h-11 underline"
          onClick={() => weather.refetch()}
        >
          Retry
        </button>
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:items-start">
      <div className="flex min-w-0 flex-col gap-4 md:col-span-2">
        <CurrentWeather
          data={data}
          updatedAt={weather.dataUpdatedAt}
          fetching={weather.isFetching || air.isFetching}
          onRefresh={() => {
            weather.refetch();
            air.refetch();
          }}
          alert={alerts[0]}
          alertCount={alerts.length}
          onOpenAlerts={openPanel}
        />
        <HourlyForecast data={data} />
        <ErrorBoundary name="Chart">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <TempChart data={data} />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
        <DailyForecast data={data} className="md:col-span-2 lg:col-span-1" />
        <AirQuality air={air.data} />
        <SunCard data={data} />
      </div>

      <InsightsCard
        data={data}
        unit={unit}
        className="md:col-span-2 lg:col-span-3"
      />
      <DetailCards
        data={data}
        unit={unit}
        className="md:col-span-2 lg:col-span-3"
      />
      <ErrorBoundary name="Radar" className="md:col-span-2 lg:col-span-3">
        <Suspense
          fallback={<Skeleton className="h-80 md:col-span-2 lg:col-span-3" />}
        >
          <RadarMap city={city} className="md:col-span-2 lg:col-span-3" />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
