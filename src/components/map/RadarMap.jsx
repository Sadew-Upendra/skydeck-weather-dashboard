import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { CloudRain, LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";
import Card from "../ui/Card";

const cityIcon = L.divIcon({
  className: "city-marker",
  html: '<span class="city-marker-pulse"></span><span class="city-marker-dot"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapHelpers({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  useEffect(() => {
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(map.getContainer());
    return () => ro.disconnect();
  }, [map]);
  return null;
}

export default function RadarMap({ city, className = "" }) {
  const [map, setMap] = useState(null);

  // On touch screens, one-finger drag scrolls the page; two fingers pinch/zoom the map.
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const { data } = useQuery({
    queryKey: ["radar"],
    queryFn: () =>
      fetch("https://api.rainviewer.com/public/weather-maps.json").then((r) =>
        r.json(),
      ),
    staleTime: 5 * 60 * 1000,
  });
  const frame = data?.radar?.past?.at(-1);
  const frameTime = frame
    ? new Date(frame.time * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : null;

  const center = [city.latitude, city.longitude];

  return (
    <Card title="Precipitation radar" icon={CloudRain} className={className}>
      <div className="h-64 overflow-hidden rounded-2xl sm:h-80 md:h-96">
        <MapContainer
          ref={setMap}
          center={center}
          zoom={6}
          scrollWheelZoom={false}
          dragging={!coarse}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {frame && (
            <TileLayer
              key={frame.path}
              url={`${data.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`}
              opacity={0.7}
              maxNativeZoom={7}
            />
          )}

          <Marker position={center} icon={cityIcon} title={city.name} keyboard={false}>
            <Tooltip permanent direction="top" offset={[0, -8]} className="city-tooltip">
              {city.name}
            </Tooltip>
          </Marker>

          <MapHelpers lat={city.latitude} lon={city.longitude} />
        </MapContainer>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {coarse ? "Pinch with two fingers to zoom. " : ""}
          {frameTime ? `Latest radar ${frameTime} (your time). ` : ""}
          Radar by RainViewer
        </p>
        <button
          onClick={() => map?.setView(center, 6)}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-slate-500/10 px-4 text-sm font-medium transition hover:bg-slate-500/20"
        >
          <LocateFixed size={16} aria-hidden /> Re-center
        </button>
      </div>
    </Card>
  );
}
