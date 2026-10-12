import { useEffect, useRef } from "react";
import { CheckCircle2, Lightbulb, X } from "lucide-react";
import { LEVELS, NOW_IDS } from "./alertMeta";
import AlertIcon from "./AlertIcon";

export default function AlertPanel({ alerts, newIds, cityName, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <button
        tabIndex={-1}
        aria-label="Close alerts"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default bg-black/50 sm:bg-transparent"
      />

      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-label="Weather alerts"
        className="sheet-in fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] text-left text-slate-900 shadow-2xl outline-none sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-3 sm:max-h-[70vh] sm:w-[26rem] sm:rounded-2xl sm:pb-0 dark:bg-slate-900 dark:text-slate-100"
      >
        <div aria-hidden className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-slate-400/50 sm:hidden" />

        <header className="flex items-center justify-between gap-3 border-b border-slate-500/15 px-4 py-2 sm:py-3">
          <div className="min-w-0">
            <h2 className="font-semibold">Weather alerts</h2>
            <p className="truncate text-xs text-slate-600 dark:text-slate-400">
              {cityName} · {alerts.length ? `${alerts.length} active` : "All clear"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-600 hover:bg-slate-500/10 dark:text-slate-300"
          >
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={28} aria-hidden />
              </span>
              <p className="mt-3 font-semibold">All clear</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                No weather alerts for {cityName} right now. We re-check every 10 minutes.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-500/15">
              {alerts.map((a) => {
                const L = LEVELS[a.level];
                return (
                  <li key={a.id} className={`flex gap-3 border-l-4 p-4 ${L.accent} ${newIds.has(a.id) ? "bg-slate-500/5" : ""}`}>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${L.chip}`}>
                      <AlertIcon alert={a} size={20} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="font-semibold">{a.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${L.solid}`}>
                          {L.label}
                        </span>
                        {newIds.has(a.id) && (
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                        {NOW_IDS.includes(a.id) ? "Right now" : "Today"}
                      </p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{a.text}</p>
                      {a.tip && (
                        <p className="mt-2 flex items-start gap-2 rounded-lg bg-slate-500/10 px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                          <Lightbulb size={14} className="mt-0.5 shrink-0" aria-hidden />
                          {a.tip}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="border-t border-slate-500/15 px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
            Alerts are generated from forecast data and are not official warnings.
            For official advisories, check your national weather service.
          </p>
        </div>
      </div>
    </>
  );
}
