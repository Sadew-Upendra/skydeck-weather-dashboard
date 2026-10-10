import { AlertTriangle } from "lucide-react";

const styles = { danger: "bg-red-600", warning: "bg-amber-700" };

export default function AlertBanner({ alerts }) {
  return (
    <div role="status" aria-live="polite" className="space-y-2 empty:hidden">
      {alerts.map((a) => (
        <div key={a.text} className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm text-white shadow-lg ${styles[a.level]}`}>
          <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden />
          {a.text}
        </div>
      ))}
    </div>
  );
}