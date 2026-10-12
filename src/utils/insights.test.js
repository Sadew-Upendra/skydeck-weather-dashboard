import { describe, it, expect } from "vitest";
import { getInsights } from "./insights";

function mock({ feels = 28, uv = 3, rain = 10, hours } = {}) {
  // 30 consecutive hours starting at 2026-10-10T06:00
  const start = new Date("2026-10-10T06:00");
  const time = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(start.getTime() + i * 3600000);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`;
  });
  const h =
    hours ??
    ((i) => ({
      temp: 24,
      pop: 10,
      code: 1,
      isDay: i + 6 >= 6 && (i + 6) % 24 < 18 ? 1 : 0,
    }));
  const rows = time.map((_, i) => h(i));
  return {
    current: {
      time: "2026-10-10T06:15",
      apparent_temperature: feels,
      wind_speed_10m: 10,
    },
    daily: {
      uv_index_max: [uv],
      precipitation_probability_max: [rain],
      weather_code: [1],
    },
    hourly: {
      time,
      temperature_2m: rows.map((r) => r.temp),
      precipitation_probability: rows.map((r) => r.pop),
      weather_code: rows.map((r) => r.code),
      is_day: rows.map((r) => r.isDay),
    },
  };
}

describe("getInsights", () => {
  it("suggests light clothing in the heat", () => {
    expect(getInsights(mock({ feels: 35 }), "C").headline).toMatch(/Hot/);
  });

  it("suggests a coat when freezing", () => {
    expect(getInsights(mock({ feels: -5 }), "C").headline).toBe("Freezing");
  });

  it("adds umbrella and sun protection when relevant", () => {
    const labels = getInsights(mock({ rain: 80, uv: 9 }), "C").items.map(
      (i) => i.label,
    );
    expect(labels).toContain("Umbrella or rain jacket");
    expect(labels).toContain("Sunscreen, hat and sunglasses");
  });

  it("picks the driest comfortable daylight window", () => {
    const data = mock({
      hours: (i) => ({
        temp: 24,
        pop: i === 5 || i === 6 ? 0 : 60,
        code: 1,
        isDay: 1,
      }),
    });
    const w = getInsights(data, "C").bestWindow;
    expect(w.pop).toBe(0);
    expect(w.reason).toBe("Dry and comfortable");
  });

  it("returns no window when there is no daylight", () => {
    const data = mock({
      hours: () => ({ temp: 20, pop: 0, code: 0, isDay: 0 }),
    });
    expect(getInsights(data, "C").bestWindow).toBeNull();
  });

  it("builds a 24-hour comfort timeline and marks the best window", () => {
    const data = mock({
      hours: (i) => ({
        temp: 24,
        pop: i === 5 || i === 6 ? 0 : 70,
        code: 1,
        isDay: 1,
      }),
    });
    const { timeline, bestWindow } = getInsights(data, "C");
    expect(timeline).toHaveLength(24);
    expect(timeline[bestWindow.start].level).toBe("great");
    expect(timeline[0].level).toBe("poor");
  });

  it("rates hot weather as less comfortable than mild weather", () => {
    const hot = getInsights(
      mock({ hours: () => ({ temp: 38, pop: 0, code: 0, isDay: 1 }) }),
      "C",
    );
    const mild = getInsights(
      mock({ hours: () => ({ temp: 24, pop: 0, code: 0, isDay: 1 }) }),
      "C",
    );
    expect(hot.timeline[0].level).not.toBe("great");
    expect(mild.timeline[0].level).toBe("great");
  });
});
