import { describe, it, expect } from "vitest";
import { getSunInfo, formatDuration } from "./sun";

const make = (time) => ({
  current: { time },
  daily: {
    sunrise: ["2026-10-12T06:00", "2026-10-13T06:00"],
    sunset: ["2026-10-12T18:00", "2026-10-13T18:00"],
  },
});

describe("sun helpers", () => {
  it("formats durations", () => {
    expect(formatDuration(45 * 60000)).toBe("45 m");
    expect(formatDuration(125 * 60000)).toBe("2 h 5 m");
  });

  it("tracks the sun during the day", () => {
    const s = getSunInfo(make("2026-10-12T14:00"));
    expect(s.isUp).toBe(true);
    expect(s.progress).toBeCloseTo(2 / 3, 5);
    expect(s.daylight).toBe("12 h 0 m");
    expect(s.status).toBe("Sunset in 4 h 0 m");
  });

  it("counts down to sunrise before dawn", () => {
    const s = getSunInfo(make("2026-10-12T05:00"));
    expect(s.isUp).toBe(false);
    expect(s.progress).toBe(0);
    expect(s.status).toBe("Sunrise in 1 h 0 m");
  });

  it("counts down to tomorrow's sunrise after sunset", () => {
    const s = getSunInfo(make("2026-10-12T20:00"));
    expect(s.isUp).toBe(false);
    expect(s.progress).toBe(1);
    expect(s.status).toBe("Sunrise in 10 h 0 m");
  });
});
