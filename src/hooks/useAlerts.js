import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import { useWeather } from "./useWeather";
import { getAlerts } from "../utils/alerts";

export function useAlerts() {
  const { city, unit } = useAppStore();
  const { weather, air } = useWeather(city, unit);
  const data = weather.data;
  const airData = air.data;

  return useMemo(
    () => ({
      alerts: data ? getAlerts(data, airData, unit) : [],
      scope: data ? `${city.latitude},${city.longitude}:${data.daily.time[0]}` : "",
    }),
    [data, airData, unit, city.latitude, city.longitude]
  );
}
