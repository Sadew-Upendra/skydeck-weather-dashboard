import { Sun } from "lucide-react";

export default function PageLoader({ label = "Loading…" }) {
  return (
    <div role="status" className="grid min-h-48 place-items-center rounded-3xl bg-white/10 text-white backdrop-blur">
      <div className="flex flex-col items-center gap-3">
        <Sun size={36} className="animate-spin [animation-duration:3s]" aria-hidden />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}