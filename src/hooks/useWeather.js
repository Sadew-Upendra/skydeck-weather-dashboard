import { useQuery } from "@tanstack/react-query";
import { fetchForecast, fetchAirQuality } from "../api/weather";

const TEN_MIN = 10 * 60 * 1000;

export function useWeather(city, unit) {
  const weather = useQuery({
    queryKey: ["forecast", city.latitude, city.longitude, unit],
    queryFn: () => fetchForecast(city, unit),
    staleTime: TEN_MIN,
  });
  const air = useQuery({
    queryKey: ["air", city.latitude, city.longitude],
    queryFn: () => fetchAirQuality(city),
    staleTime: TEN_MIN,
  });
  return { weather, air };
}