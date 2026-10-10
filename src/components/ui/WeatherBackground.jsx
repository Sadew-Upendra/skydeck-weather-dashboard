import { useMemo } from "react";

const COUNT = { rain: 70, storm: 100, snow: 50 };

export default function WeatherBackground({ mood }) {
  const scale = typeof window !== "undefined" && window.innerWidth < 640 ? 0.5 : 1;
  const n = Math.round((COUNT[mood] ?? 0) * scale);
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