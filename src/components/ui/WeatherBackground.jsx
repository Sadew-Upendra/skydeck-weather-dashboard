const COUNT = { rain: 70, storm: 100, snow: 50 };

const PARTICLES = Array.from({ length: Math.max(...Object.values(COUNT)) }, () => ({
  left: Math.random() * 100,
  delay: Math.random() * 6,
  speed: Math.random(),
}));

export default function WeatherBackground({ mood }) {
  const scale = typeof window !== "undefined" && window.innerWidth < 640 ? 0.5 : 1;
  const n = Math.round((COUNT[mood] ?? 0) * scale);
  const snow = mood === "snow";

  if (!n) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {PARTICLES.slice(0, n).map((p, i) => (
        <span
          key={i}
          className={snow ? "flake" : "drop"}
          style={{
            left: `${p.left}%`,
            animationDelay: `-${p.delay}s`,
            animationDuration: `${snow ? 6 + p.speed * 6 : 0.6 + p.speed * 0.6}s`,
          }}
        />
      ))}
    </div>
  );
}