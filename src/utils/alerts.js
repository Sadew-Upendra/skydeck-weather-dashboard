const RANK = { danger: 0, warning: 1, info: 2 };
const HEAVY_RAIN = [65, 67, 82];
const FOG = [45, 48];

const toC = (v, unit) => (unit === "F" ? ((v - 32) * 5) / 9 : v);
const toKmh = (v, unit) => (unit === "F" ? v * 1.609 : v);

export function getAlerts(data, air, unit) {
  const c = data.current;
  const d = data.daily;
  const out = [];
  const add = (id, level, icon, title, text, tip) =>
    out.push({ id, level, icon, title, text, tip });

  const code = d.weather_code[0];
  const feelsC = toC(c.apparent_temperature, unit);
  const tempC = toC(c.temperature_2m, unit);
  const windKmh = toKmh(c.wind_speed_10m, unit);
  const feels = Math.round(c.apparent_temperature);
  const windText = `${Math.round(c.wind_speed_10m)} ${unit === "F" ? "mph" : "km/h"}`;
  const rain = d.precipitation_probability_max[0] ?? 0;
  const uv = d.uv_index_max[0];
  const aqi = air?.current?.us_aqi;
  const humidity = c.relative_humidity_2m;

  const storm = code >= 95;
  const heavyRain = HEAVY_RAIN.includes(code);

  // Precipitation & visibility
  if (storm)
    add(
      "storm",
      "danger",
      "storm",
      "Thunderstorms expected",
      "Thunderstorms are forecast for today.",
      "Stay indoors and away from open areas and tall trees.",
    );
  else if (heavyRain)
    add(
      "heavy-rain",
      "warning",
      "rain",
      "Heavy rain expected",
      "Intense rainfall is forecast today.",
      "Avoid flood-prone roads and allow extra travel time.",
    );
  else if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    add(
      "snow",
      "warning",
      "snow",
      "Snowfall expected",
      "Snow is forecast for today.",
      "Roads and pavements may be slippery. Drive carefully.",
    );
  else if (rain >= 70)
    add(
      "rain-likely",
      "info",
      "umbrella",
      "Rain likely today",
      `${rain}% chance of precipitation.`,
      "Carry an umbrella or a rain jacket.",
    );

  if (FOG.includes(c.weather_code))
    add(
      "fog",
      "info",
      "fog",
      "Foggy conditions",
      "Visibility is reduced right now.",
      "Use low-beam headlights and slow down.",
    );

  // Temperature
  if (feelsC >= 38)
    add(
      "heat",
      "danger",
      "heat",
      "Extreme heat",
      `It feels like ${feels}° – heat can be dangerous.`,
      "Stay hydrated, find shade or air conditioning, and avoid strenuous activity.",
    );
  else if (feelsC >= 35)
    add(
      "heat",
      "warning",
      "heat",
      "High heat",
      `It feels like ${feels}° – heat stress is possible.`,
      "Drink water often and take breaks in the shade.",
    );
  else if (humidity >= 80 && tempC >= 30)
    add(
      "humid",
      "info",
      "humidity",
      "Muggy conditions",
      `Humidity is ${humidity}%, so it feels heavier than the temperature suggests.`,
      "Take it easy outdoors and drink plenty of water.",
    );

  if (feelsC <= -10)
    add(
      "cold",
      "danger",
      "cold",
      "Extreme cold",
      `It feels like ${feels}° – frostbite is possible on exposed skin.`,
      "Dress in layers and limit time outside.",
    );
  else if (feelsC <= 0)
    add(
      "cold",
      "warning",
      "cold",
      "Freezing temperatures",
      `It feels like ${feels}°.`,
      "Watch for ice on roads and pavements.",
    );

  // Wind
  if (windKmh >= 75)
    add(
      "wind",
      "danger",
      "wind",
      "Damaging winds",
      `Winds are around ${windText}.`,
      "Stay indoors and away from trees and power lines.",
    );
  else if (windKmh >= 50)
    add(
      "wind",
      "warning",
      "wind",
      "Strong winds",
      `Winds are around ${windText}.`,
      "Secure loose outdoor objects and take care when driving.",
    );

  // UV
  if (uv >= 11)
    add(
      "uv",
      "warning",
      "uv",
      "Extreme UV",
      `UV index ${Math.round(uv)} today.`,
      "Avoid midday sun. Use SPF 50+, a hat and sunglasses.",
    );
  else if (uv >= 8)
    add(
      "uv",
      "info",
      "uv",
      "Very high UV",
      `UV index ${Math.round(uv)} today.`,
      "Use sunscreen and seek shade around midday.",
    );

  // Air quality
  if (aqi > 200)
    add(
      "air",
      "danger",
      "air",
      "Very unhealthy air",
      `Air quality index is ${aqi}.`,
      "Stay indoors. Wear an N95 mask if you must go out.",
    );
  else if (aqi > 150)
    add(
      "air",
      "warning",
      "air",
      "Unhealthy air",
      `Air quality is unhealthy (AQI ${aqi}).`,
      "Limit outdoor exercise, especially for children and older adults.",
    );
  else if (aqi > 100)
    add(
      "air",
      "info",
      "air",
      "Moderate air quality",
      `AQI ${aqi} – acceptable for most people.`,
      "Sensitive groups should reduce long outdoor activity.",
    );

  return out.sort((a, b) => RANK[a.level] - RANK[b.level]);
}
