import { LocateFixed, Moon, Sun } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import SearchBar from "./SearchBar";

const btn =
  "grid h-10 min-w-10 place-items-center rounded-full bg-white/20 px-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30";

export default function Header() {
  const { unit, theme, toggleUnit, toggleTheme, setCity } = useAppStore();

  const locate = () =>
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setCity({ name: "My location", country: "", latitude: coords.latitude, longitude: coords.longitude }),
      () => alert("Location permission denied.")
    );

  return (
    <header className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-white">
        <img src="/favicon.svg" alt="" className="h-9 w-9" />
        <span className="text-xl font-semibold tracking-tight">SkyDeck</span>
      </div>
      <div className="order-last w-full md:order-none md:mx-auto md:max-w-md md:flex-1">
        <SearchBar />
      </div>
      <div className="ml-auto flex gap-2 md:ml-0">
        <button onClick={locate} className={btn} aria-label="Use my location">
          <LocateFixed size={18} />
        </button>
        <button onClick={toggleUnit} className={btn} aria-label="Toggle unit">°{unit}</button>
        <button onClick={toggleTheme} className={btn} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}