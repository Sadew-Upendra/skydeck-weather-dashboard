import { nextHours } from "./format";

const toC = (v, unit) => (unit === "F" ? ((v - 32) * 5) / 9 : v);
const RAIN_CODES = [
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
];

function outfit(data, unit) {
  const c = data.current;
  const d = data.daily;
  const feelsC = toC(c.apparent_temperature, unit);
  const windKmh = unit === "F" ? c.wind_speed_10m * 1.609 : c.wind_speed_10m;
  const uv = d.uv_index_max[0] ?? 0;
  const rain = d.precipitation_probability_max[0] ?? 0;

  let headline;
  const items = [];
  const add = (key, label) => items.push({ key, label });

  if (feelsC >= 32) {
    headline = "Hot – dress light";
    add("clothes", "Light, breathable clothes");
  } else if (feelsC >= 25) {
    headline = "Warm and comfortable";
    add("clothes", "T-shirt and shorts");
  } else if (feelsC >= 18) {
    headline = "Mild";
    add("clothes", "Light layer or long sleeves");
  } else if (feelsC >= 10) {
    headline = "Cool";
    add("clothes", "Jacket or sweater");
  } else if (feelsC >= 0) {
    headline = "Cold";
    add("clothes", "Warm coat, scarf and gloves");
  } else {
    headline = "Freezing";
    add("clothes", "Heavy winter coat, hat and gloves");
  }

  if (rain >= 50 || RAIN_CODES.includes(d.weather_code[0]))
    add("umbrella", "Umbrella or rain jacket");
  if (uv >= 8) add("sun", "Sunscreen, hat and sunglasses");
  else if (uv >= 6) add("sun", "Sunscreen and sunglasses");
  if (windKmh >= 40) add("wind", "Windproof layer");

  return { headline, items };
}

// 0 = perfect. Penalises rain chance, wet weather codes, and temperatures outside 20–28°C.
function hourScore(h, unit) {
  const t = toC(h.temp, unit);
  const tempPenalty = t < 20 ? (20 - t) * 4 : t > 28 ? (t - 28) * 5 : 0;
  return (h.pop ?? 0) + (h.code >= 51 ? 25 : 0) + tempPenalty;
}
const levelOf = (s) => (s <= 25 ? "great" : s <= 55 ? "ok" : "poor");

export function getInsights(data, unit) {
  const rows = nextHours(data, 24).map((h) => {
    const score = hourScore(h, unit);
    return { ...h, score, level: levelOf(score) };
  });

  // Best 2-hour daylight window.
  let best = null;
  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    const b = rows[i + 1];
    if (!a.isDay || !b.isDay) continue;
    const score = (a.score + b.score) / 2;
    if (!best || score < best.score) best = { score, start: i };
  }

  let bestWindow = null;
  if (best) {
    const a = rows[best.start];
    const b = rows[best.start + 1];
    const pop = Math.round(((a.pop ?? 0) + (b.pop ?? 0)) / 2);
    const end = new Date(
      new Date(b.time).getTime() + 3600000,
    ).toLocaleTimeString([], { hour: "numeric" });
    bestWindow = {
      start: best.start,
      label: `${a.hour} – ${end}`,
      temp: Math.round((a.temp + b.temp) / 2),
      pop,
      reason:
        pop <= 20
          ? "Dry and comfortable"
          : pop <= 50
            ? "Lowest chance of rain"
            : "Least wet period",
    };
  }

  return { ...outfit(data, unit), timeline: rows, bestWindow };
}
