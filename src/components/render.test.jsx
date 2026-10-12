import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import AlertPanel from "./alerts/AlertPanel";
import InsightsCard from "./weather/InsightsCard";

const alerts = [
  {
    id: "storm",
    level: "danger",
    icon: "storm",
    title: "Thunderstorms expected",
    text: "Storms today.",
    tip: "Stay indoors.",
  },
  {
    id: "uv",
    level: "info",
    icon: "uv",
    title: "Very high UV",
    text: "UV 9.",
    tip: "Sunscreen.",
  },
];

describe("render smoke tests", () => {
  it("renders the alert panel with severity, tips, 'New' tags and the disclaimer", () => {
    const html = renderToString(
      <AlertPanel
        alerts={alerts}
        newIds={new Set(["storm"])}
        cityName="Colombo"
        onClose={() => {}}
      />,
    );
    expect(html).toContain("Weather alerts");
    expect(html).toContain("Thunderstorms expected");
    expect(html).toContain("Stay indoors.");
    expect(html).toContain("Danger");
    expect(html).toContain("Advisory");
    expect(html).toContain("not official warnings");
    expect(html).toContain("2 active");
    // only the first alert was new when the panel opened
    expect(html.match(/>New</g)).toHaveLength(1);
  });

  it("shows a friendly empty state when there are no alerts", () => {
    const html = renderToString(
      <AlertPanel
        alerts={[]}
        newIds={new Set()}
        cityName="Colombo"
        onClose={() => {}}
      />,
    );
    expect(html).toContain("All clear");
    expect(html).toContain("No weather alerts for");
    expect(html).toContain("Colombo");
  });

  it("renders the insights card with a timeline and best time", () => {
    const start = new Date("2026-10-10T06:00");
    const p = (n) => String(n).padStart(2, "0");
    const time = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(start.getTime() + i * 3600000);
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`;
    });
    const data = {
      current: {
        time: "2026-10-10T06:15",
        apparent_temperature: 29,
        wind_speed_10m: 8,
      },
      daily: {
        uv_index_max: [7],
        precipitation_probability_max: [30],
        weather_code: [1],
      },
      hourly: {
        time,
        temperature_2m: time.map(() => 27),
        precipitation_probability: time.map(() => 10),
        weather_code: time.map(() => 1),
        is_day: time.map(() => 1),
      },
    };
    const html = renderToString(<InsightsCard data={data} unit="C" />);
    expect(html).toContain("Today&#x27;s guide");
    expect(html).toContain("Best time");
    expect(html).toContain("Sunscreen and sunglasses");
  });
});
