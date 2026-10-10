export const compass = (deg) =>
  ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(deg / 45) % 8];

export const hourLabel = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric" });

export const timeLabel = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const dayLabel = (iso, i) =>
  i === 0 ? "Today" : new Date(`${iso}T12:00`).toLocaleDateString([], { weekday: "short" });

export function nextHours(data, n = 24) {
  const { hourly, current } = data;
  const now = current.time.slice(0, 13);
  let start = hourly.time.findIndex((t) => t.slice(0, 13) >= now);
  if (start < 0) start = 0;
  return hourly.time.slice(start, start + n).map((t, i) => ({
    time: t,
    hour: hourLabel(t),
    temp: Math.round(hourly.temperature_2m[start + i]),
    pop: hourly.precipitation_probability[start + i],
    code: hourly.weather_code[start + i],
    isDay: hourly.is_day[start + i],
  }));
}

export function aqiInfo(v) {
  if (v <= 50) return { label: "Good", color: "bg-green-500" };
  if (v <= 100) return { label: "Moderate", color: "bg-yellow-500" };
  if (v <= 150) return { label: "Unhealthy for sensitive groups", color: "bg-orange-500" };
  if (v <= 200) return { label: "Unhealthy", color: "bg-red-500" };
  if (v <= 300) return { label: "Very unhealthy", color: "bg-purple-600" };
  return { label: "Hazardous", color: "bg-rose-900" };
}

export function uvInfo(v) {
  if (v < 3) return "Low";
  if (v < 6) return "Moderate";
  if (v < 8) return "High";
  if (v < 11) return "Very high";
  return "Extreme";
}