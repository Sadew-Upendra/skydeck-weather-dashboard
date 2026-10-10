import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { searchCities } from "../../api/weather";
import { useAppStore } from "../../store/useAppStore";

export default function SearchBar() {
  const [text, setText] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const setCity = useAppStore((s) => s.setCity);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(text.trim()), 350);
    return () => clearTimeout(t);
  }, [text]);

  const { data = [] } = useQuery({
    queryKey: ["geo", debounced],
    queryFn: () => searchCities(debounced),
    enabled: debounced.length >= 2,
  });

  const pick = (r) => {
    setCity({ name: r.name, country: r.country ?? "", latitude: r.latitude, longitude: r.longitude });
    setText("");
    setOpen(false);
  };

  const showList = open && data.length > 0;

  return (
    <div
      className="relative w-full"
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
    >
      <Search size={18} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/80" />
      <input
        type="search"
        value={text}
        onChange={(e) => { setText(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        placeholder="Search city…"
        aria-label="Search city"
        autoComplete="off"
        className="h-11 w-full rounded-full bg-white/20 pl-11 pr-4 text-base text-white placeholder-white/80 outline-none ring-1 ring-white/30 backdrop-blur focus:ring-2 focus:ring-white"
      />
      <p className="sr-only" aria-live="polite">{showList ? `${data.length} results` : ""}</p>

      {showList && (
        <ul
          aria-label="Search results"
          className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl bg-white text-slate-900 shadow-xl"
        >
          {data.map((r) => (
            <li key={r.id}>
              <button onClick={() => pick(r)} className="min-h-11 w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100">
                <span className="font-medium">{r.name}</span>
                <span className="text-slate-600">
                  {[r.admin1, r.country].filter(Boolean).map((x) => `, ${x}`).join("")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}