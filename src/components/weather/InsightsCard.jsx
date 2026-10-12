import { Clock, Shirt, Sparkles, Sun, Umbrella, Wind } from "lucide-react";
import Card from "../ui/Card";
import { getInsights } from "../../utils/insights";

const CHIP_ICONS = {
  clothes: Shirt,
  umbrella: Umbrella,
  sun: Sun,
  wind: Wind,
};

const SEGMENT = {
  great: "bg-emerald-500",
  ok: "bg-amber-400",
  poor: "bg-rose-500",
};

export default function InsightsCard({ data, unit, className = "" }) {
  const { headline, items, timeline, bestWindow } = getInsights(data, unit);
  const inBest = (i) =>
    bestWindow && (i === bestWindow.start || i === bestWindow.start + 1);
  const ticks = [0, 6, 12, 18, 23].filter((i) => timeline[i]);

  return (
    <Card title="Today's guide" icon={Sparkles} className={className}>
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        {/* What to wear */}
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            What to wear
          </p>
          <p className="mt-1 text-xl font-semibold">{headline}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {items.map(({ key, label }) => {
              const Icon = CHIP_ICONS[key];
              return (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full bg-slate-500/10 py-1.5 pl-2 pr-3 text-sm"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300">
                    <Icon size={14} aria-hidden />
                  </span>
                  {label}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Outdoor comfort timeline */}
        <div className="lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Outdoor comfort · next 24 hours
          </p>

          <div
            role="img"
            aria-label={
              bestWindow
                ? `Outdoor comfort for the next 24 hours. Best time: ${bestWindow.label}. ${bestWindow.reason}.`
                : "Outdoor comfort for the next 24 hours. No daylight window available."
            }
            className="mt-3"
          >
            <div className="flex gap-0.5">
              {timeline.map((h, i) => (
                <div
                  key={h.time}
                  title={`${h.hour} · ${h.temp}° · ${h.pop ?? 0}% rain`}
                  className={`h-10 flex-1 rounded-md ${h.isDay ? SEGMENT[h.level] : "bg-slate-500/25"} ${
                    inBest(i)
                      ? "relative z-10 ring-2 ring-slate-900 dark:ring-white"
                      : ""
                  }`}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-slate-600 dark:text-slate-400">
              {ticks.map((i) => (
                <span key={i}>{i === 0 ? "Now" : timeline[i].hour}</span>
              ))}
            </div>
          </div>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Great
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Okay
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" /> Poor
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-500/25" /> Night
            </li>
          </ul>

          <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-900 dark:text-emerald-200">
            <Clock size={16} className="mt-0.5 shrink-0" aria-hidden />
            {bestWindow ? (
              <span>
                <strong>Best time: {bestWindow.label}</strong> ·{" "}
                {bestWindow.reason} · {bestWindow.temp}° · {bestWindow.pop}%
                rain
              </span>
            ) : (
              <span>No daylight hours left in the next 24 hours.</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
