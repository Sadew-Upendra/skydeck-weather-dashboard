import { useAppStore } from "../../store/useAppStore";

export default function SavedCities() {
  const { saved, city, setCity } = useAppStore();
  if (!saved.length) return null;
  return (
    <nav aria-label="Saved cities" className="no-scrollbar flex snap-x gap-2 overflow-x-auto overscroll-x-contain">
      {saved.map((c) => {
        const active = c.latitude === city.latitude && c.longitude === city.longitude;
        return (
          <button
            key={`${c.latitude},${c.longitude}`}
            onClick={() => setCity(c)}
            aria-pressed={active}
            className={`h-10 shrink-0 snap-start whitespace-nowrap rounded-full px-4 text-sm backdrop-blur transition ${
              active ? "bg-white text-slate-900" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </nav>
  );
}