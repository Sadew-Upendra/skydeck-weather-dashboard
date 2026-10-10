import { describe, it, expect } from "vitest";
import { getAlerts } from "./alerts";

const base = {
  current: { apparent_temperature: 30, wind_speed_10m: 10 },
  daily: { precipitation_probability_max: [10], uv_index_max: [5], weather_code: [1] },
};

describe("getAlerts", () => {
  it("returns nothing on a calm day", () => {
    expect(getAlerts(base, null, "C")).toEqual([]);
  });

  it("flags thunderstorms as danger", () => {
    const d = { ...base, daily: { ...base.daily, weather_code: [95] } };
    expect(getAlerts(d, null, "C")[0].level).toBe("danger");
  });

  it("converts °F before checking extreme heat", () => {
    const d = { ...base, current: { ...base.current, apparent_temperature: 104 } };
    expect(getAlerts(d, null, "F").some((a) => a.text.includes("heat"))).toBe(true);
  });
});