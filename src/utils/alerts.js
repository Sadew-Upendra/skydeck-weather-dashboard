export function getAlerts(data, air, unit) {
  const c = data.current;
  const d = data.daily;
  const out = [];

  const feelsC =
    unit === "F"
      ? ((c.apparent_temperature - 32) * 5) / 9
      : c.apparent_temperature;
  const windKmh = unit === "F" ? c.wind_speed_10m * 1.609 : c.wind_speed_10m;
  const rain = d.precipitation_probability_max[0] ?? 0;
  const uv = d.uv_index_max[0];
  const aqi = air?.current?.us_aqi;

  if (d.weather_code[0] >= 95)
    out.push({
      level: "danger",
      text: "Thunderstorms expected today. Stay indoors if possible.",
    });
  if (feelsC >= 38)
    out.push({
      level: "danger",
      text: "Extreme heat. Stay hydrated and avoid strenuous activity.",
    });
  if (feelsC <= -10)
    out.push({
      level: "danger",
      text: "Extreme cold. Dress in layers and limit time outside.",
    });
  if (windKmh >= 50)
    out.push({
      level: "warning",
      text: "Strong winds right now. Secure loose objects.",
    });
  if (rain >= 70)
    out.push({
      level: "warning",
      text: `High chance of rain today (${rain}%). Carry an umbrella.`,
    });
  if (uv >= 8)
    out.push({
      level: "warning",
      text: `UV index ${Math.round(uv)}. Use sunscreen and avoid midday sun.`,
    });
  if (aqi > 150)
    out.push({
      level: "warning",
      text: `Air quality is unhealthy (AQI ${aqi}). Limit outdoor exercise.`,
    });

  return out;
}
