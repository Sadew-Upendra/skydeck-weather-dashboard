import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { CloudRain } from "lucide-react";
import "leaflet/dist/leaflet.css";
import Card from "../ui/Card";

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

  return (
    <Card title="Precipitation radar" icon={CloudRain} className={className}>
      <div className="h-64 overflow-hidden rounded-2xl sm:h-80 md:h-96">
        <MapContainer
          center={[city.latitude, city.longitude]}
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
          <MapHelpers lat={city.latitude} lon={city.longitude} />
        </MapContainer>
      </div>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
        {coarse ? "Pinch with two fingers to zoom. " : ""}Radar by RainViewer
      </p>
    </Card>
  );
}
