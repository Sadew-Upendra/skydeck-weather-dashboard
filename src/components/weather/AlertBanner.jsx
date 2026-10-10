import { AlertTriangle } from "lucide-react";

const styles = { danger: "bg-red-500/90", warning: "bg-amber-500/90" };

export default function AlertBanner({ alerts }) {
  if (!alerts.length) return null;
  return (
    <div className="space-y-2" role="status">
      {alerts.map((a) => (
        <div
          key={a.text}
          className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm text-white shadow-lg ${styles[a.level]}`}
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          {a.text}
        </div>
      ))}
    </div>
  );
}