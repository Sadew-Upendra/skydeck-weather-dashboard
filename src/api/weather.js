const GEO = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST = "https://api.open-meteo.com/v1/forecast";
const AIR = "https://air-quality-api.open-meteo.com/v1/air-quality";

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export async function searchCities(name) {
  if (!name || name.length < 2) return [];
  const data = await getJSON(
    `${GEO}?name=${encodeURIComponent(name)}&count=6&language=en&format=json`
  );
  return data.results ?? [];
}

export function fetchForecast({ latitude, longitude }, unit) {
  const f = unit === "F";
  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation_probability,weather_code,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max",
    timezone: "auto",
    forecast_days: 7,
    temperature_unit: f ? "fahrenheit" : "celsius",
    wind_speed_unit: f ? "mph" : "kmh",
  });
  return getJSON(`${FORECAST}?${params}`);
}

export function fetchAirQuality({ latitude, longitude }) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "us_aqi,pm2_5,pm10",
    timezone: "auto",
  });
  return getJSON(`${AIR}?${params}`);
}

export function fetchTrends({ latitude, longitude }, unit) {
  const f = unit === "F";
  const params = new URLSearchParams({
    latitude,
    longitude,
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
    timezone: "auto",
    forecast_days: 16,
    temperature_unit: f ? "fahrenheit" : "celsius",
    wind_speed_unit: f ? "mph" : "kmh",
    precipitation_unit: f ? "inch" : "mm",
  });
  return getJSON(`${FORECAST}?${params}`);
}
