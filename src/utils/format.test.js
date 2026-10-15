import { describe, it, expect } from "vitest";
import { compass, aqiInfo, uvInfo, nextHours } from "./format";

describe("format utils", () => {
  it("converts degrees to compass directions", () => {
    expect(compass(0)).toBe("N");
    expect(compass(90)).toBe("E");
    expect(compass(350)).toBe("N");
  });

  it("classifies AQI", () => {
    expect(aqiInfo(30).label).toBe("Good");
    expect(aqiInfo(120).label).toBe("Unhealthy for sensitive groups");
    expect(aqiInfo(30).advice).toMatch(/great/i);
  });

  it("classifies UV", () => {
    expect(uvInfo(2)).toBe("Low");
    expect(uvInfo(9)).toBe("Very high");
  });

  it("starts the hourly list at the current hour", () => {
    const mock = {
      current: { time: "2026-10-10T14:15" },
      hourly: {
        time: ["2026-10-10T13:00", "2026-10-10T14:00", "2026-10-10T15:00"],
        temperature_2m: [28.4, 29.6, 31.2],
        precipitation_probability: [10, 20, 30],
        weather_code: [0, 1, 2],
        is_day: [1, 1, 1],
      },
    };
    const rows = nextHours(mock, 2);
    expect(rows).toHaveLength(2);
    expect(rows[0].temp).toBe(30);
    expect(rows[1].temp).toBe(31);
  });
});