import { Link } from "react-router-dom";
import { LocateFixed, Moon, Sun } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import SearchBar from "./SearchBar";
import AlertCenter from "../alerts/AlertCenter";

const btn =
  "grid h-11 min-w-11 place-items-center rounded-full bg-white/20 px-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30";

export default function Header() {
  const { unit, theme, toggleUnit, toggleTheme, setCity } = useAppStore();

  const locate = () =>
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setCity({ name: "My location", country: "", latitude: coords.latitude, longitude: coords.longitude }),
      () => alert("Location permission denied.")
    );

  return (
    <header className="relative z-30 flex flex-wrap items-center gap-3">
      <Link to="/" className="flex items-center gap-2 rounded-full text-white">
        <img src="/favicon.svg" alt="" className="h-9 w-9" />
        <span className="text-xl font-semibold tracking-tight max-[359px]:sr-only">SkyDeck</span>
      </Link>

      <div className="order-last w-full md:order-none md:mx-auto md:max-w-md md:flex-1">
        <SearchBar />
      </div>

      <div className="ml-auto flex gap-2 md:ml-0">
        <AlertCenter buttonClass={btn} />
        <button onClick={locate} className={btn} aria-label="Use my location">
          <LocateFixed size={18} />
        </button>
        <button onClick={toggleUnit} className={btn} aria-label={`Switch to °${unit === "C" ? "F" : "C"}`}>
          °{unit}
        </button>
        <button
          onClick={toggleTheme}
          className={btn}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
