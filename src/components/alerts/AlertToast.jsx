import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAlerts } from "../../hooks/useAlerts";
import { useAlertStore } from "../../store/useAlertStore";
import { useAppStore } from "../../store/useAppStore";
import { LEVELS, alertKey } from "./alertMeta";
import AlertIcon from "./AlertIcon";

const TOAST_MS = 10000; // keep in sync with .toast-progress in index.css

// A one-time pop-up for the most important unread alert (danger or warning).
export default function AlertToast() {
  const { alerts, scope } = useAlerts();
  const cityName = useAppStore((s) => s.city.name);
  const { readKeys, toasted, panelOpen, markToasted, openPanel } = useAlertStore();
  const [shown, setShown] = useState(null);
  const [paused, setPaused] = useState(false);
  const [round, setRound] = useState(0);

  const candidate =
    shown || panelOpen
      ? null
      : alerts.find(
          (a) =>
            (a.level === "danger" || a.level === "warning") &&
            !readKeys.includes(alertKey(scope, a)) &&
            !toasted.includes(alertKey(scope, a))
        );

  useEffect(() => {
    if (!candidate) return;
    const t = setTimeout(() => {
      markToasted(alertKey(scope, candidate));
      setShown(candidate);
    }, 1200);
    return () => clearTimeout(t);
  }, [candidate, scope, markToasted]);

  useEffect(() => {
    if (!shown || paused) return;
    const t = setTimeout(() => setShown(null), TOAST_MS);
    return () => clearTimeout(t);
  }, [shown, paused, round]);

  if (!shown) return null;

  const L = LEVELS[shown.level];
  const resume = () => { setPaused(false); setRound((r) => r + 1); };
  const view = () => { setShown(null); openPanel(); };

  return (
    <div className="pointer-events-none fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 sm:inset-x-auto sm:right-4 sm:w-96">
      <div
        role={shown.level === "danger" ? "alert" : "status"}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={resume}
        onFocus={() => setPaused(true)}
        onBlur={resume}
        className={`toast-in pointer-events-auto overflow-hidden rounded-2xl border-l-4 bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 dark:bg-slate-900 dark:text-slate-100 ${L.accent}`}
      >
        <div className="flex items-start gap-3 p-4">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${L.chip}`}>
            <AlertIcon alert={shown} size={20} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {L.label} · {cityName}
            </p>
            <p className="font-semibold">{shown.title}</p>
            <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">{shown.text}</p>
            <button
              onClick={view}
              className="mt-2 h-11 rounded-full bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              View details
            </button>
          </div>
          <button
            onClick={() => setShown(null)}
            aria-label="Dismiss notification"
            className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-500/10"
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-1 bg-slate-500/15">
          <div
            key={round}
            className={`toast-progress h-full ${L.bar}`}
            style={{ animationPlayState: paused ? "paused" : "running" }}
          />
        </div>
      </div>
    </div>
  );
}
