import { describe, it, expect } from "vitest";
import { getAlerts } from "./alerts";

const base = {
  current: {
    apparent_temperature: 30,
    temperature_2m: 29,
    wind_speed_10m: 10,
    relative_humidity_2m: 60,
    weather_code: 1,
  },
  daily: {
    precipitation_probability_max: [10],
    uv_index_max: [5],
    weather_code: [1],
  },
};
const withCurrent = (o) => ({ ...base, current: { ...base.current, ...o } });
const withDaily = (o) => ({ ...base, daily: { ...base.daily, ...o } });

describe("getAlerts", () => {
  it("returns nothing on a calm day", () => {
    expect(getAlerts(base, null, "C")).toEqual([]);
  });

  it("flags thunderstorms as danger with a safety tip", () => {
    const [a] = getAlerts(withDaily({ weather_code: [95] }), null, "C");
    expect(a.level).toBe("danger");
    expect(a.id).toBe("storm");
    expect(a.tip).toBeTruthy();
  });

  it("converts °F before checking extreme heat", () => {
    const alerts = getAlerts(
      withCurrent({ apparent_temperature: 104 }),
      null,
      "F",
    );
    expect(alerts.some((a) => a.id === "heat" && a.level === "danger")).toBe(
      true,
    );
  });

  it("uses a warning (not danger) for high heat", () => {
    const [a] = getAlerts(withCurrent({ apparent_temperature: 36 }), null, "C");
    expect(a).toMatchObject({ id: "heat", level: "warning" });
  });

  it("flags freezing and extreme cold separately", () => {
    expect(
      getAlerts(withCurrent({ apparent_temperature: -2 }), null, "C")[0].level,
    ).toBe("warning");
    expect(
      getAlerts(withCurrent({ apparent_temperature: -15 }), null, "C")[0].level,
    ).toBe("danger");
  });

  it("converts mph before checking wind", () => {
    // 40 mph ≈ 64 km/h → strong winds (warning)
    const [a] = getAlerts(
      withCurrent({ wind_speed_10m: 40, apparent_temperature: 75 }),
      null,
      "F",
    );
    expect(a).toMatchObject({ id: "wind", level: "warning" });
  });

  it("grades air quality", () => {
    expect(getAlerts(base, { current: { us_aqi: 120 } }, "C")[0].level).toBe(
      "info",
    );
    expect(getAlerts(base, { current: { us_aqi: 160 } }, "C")[0].level).toBe(
      "warning",
    );
    expect(getAlerts(base, { current: { us_aqi: 250 } }, "C")[0].level).toBe(
      "danger",
    );
  });

  it("sorts alerts by severity", () => {
    const data = {
      current: { ...base.current, apparent_temperature: 40 },
      daily: {
        ...base.daily,
        precipitation_probability_max: [80],
        uv_index_max: [9],
      },
    };
    const levels = getAlerts(data, null, "C").map((a) => a.level);
    expect(levels).toEqual(
      [...levels].sort(
        (x, y) =>
          ["danger", "warning", "info"].indexOf(x) -
          ["danger", "warning", "info"].indexOf(y),
      ),
    );
    expect(levels[0]).toBe("danger");
  });
});
