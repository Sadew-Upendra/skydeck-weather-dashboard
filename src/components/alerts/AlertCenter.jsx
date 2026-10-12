import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useAlerts } from "../../hooks/useAlerts";
import { useAlertStore } from "../../store/useAlertStore";
import { useAppStore } from "../../store/useAppStore";
import { alertKey } from "./alertMeta";
import AlertPanel from "./AlertPanel";

const BADGE = {
  danger: "bg-red-600 bell-pulse",
  warning: "bg-amber-700",
  info: "bg-sky-700",
};

// Opening the panel counts as "seen": the badge clears, but the alerts that were
// new when it opened keep their "New" tag until it closes.
function PanelHost({ alerts, scope, cityName }) {
  const { readKeys, markRead, closePanel } = useAlertStore();
  const [newIds] = useState(
    () =>
      new Set(
        alerts
          .filter((a) => !readKeys.includes(alertKey(scope, a)))
          .map((a) => a.id),
      ),
  );

  useEffect(() => {
    markRead(alerts.map((a) => alertKey(scope, a)));
  }, [alerts, scope, markRead]);

  return (
    <AlertPanel
      alerts={alerts}
      newIds={newIds}
      cityName={cityName}
      onClose={closePanel}
    />
  );
}

export default function AlertCenter({ buttonClass = "" }) {
  const { alerts, scope } = useAlerts();
  const cityName = useAppStore((s) => s.city.name);
  const { readKeys, panelOpen, openPanel, closePanel } = useAlertStore();
  const btnRef = useRef(null);
  const wasOpen = useRef(false);

  const unread = alerts.filter((a) => !readKeys.includes(alertKey(scope, a)));
  const top = unread[0];

  // Give focus back to the bell when the panel closes
  useEffect(() => {
    if (wasOpen.current && !panelOpen) btnRef.current?.focus();
    wasOpen.current = panelOpen;
  }, [panelOpen]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => (panelOpen ? closePanel() : openPanel())}
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
        aria-label={
          unread.length
            ? `Weather alerts, ${unread.length} new`
            : "Weather alerts"
        }
        className={`relative ${buttonClass}`}
      >
        <Bell size={18} />
        {top && (
          <span
            aria-hidden
            className={`absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold text-white ring-2 ring-white/70 ${BADGE[top.level]}`}
          >
            {unread.length}
          </span>
        )}
      </button>

      {panelOpen && (
        <PanelHost alerts={alerts} scope={scope} cityName={cityName} />
      )}
    </div>
  );
}
