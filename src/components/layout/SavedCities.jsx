import { useAppStore } from "../../store/useAppStore";

export default function SavedCities() {
  const { saved, city, setCity } = useAppStore();
  if (!saved.length) return null;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {saved.map((c) => {
        const active = c.latitude === city.latitude && c.longitude === city.longitude;
        return (
          <button
            key={`${c.latitude},${c.longitude}`}
            onClick={() => setCity(c)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm backdrop-blur transition ${
              active ? "bg-white text-slate-900" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}