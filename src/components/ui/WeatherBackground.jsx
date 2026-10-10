import { useMemo } from "react";

const COUNT = { rain: 70, storm: 100, snow: 50 };

export default function WeatherBackground({ mood }) {
  const n = COUNT[mood] ?? 0;
  const snow = mood === "snow";

  const items = useMemo(
    () =>
      Array.from({ length: n }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 6,
        dur: snow ? 6 + Math.random() * 6 : 0.6 + Math.random() * 0.6,
      })),
    [n, snow]
  );

  if (!n) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className={snow ? "flake" : "drop"}
          style={{ left: `${p.left}%`, animationDelay: `-${p.delay}s`, animationDuration: `${p.dur}s` }}
        />
      ))}
    </div>
  );
}