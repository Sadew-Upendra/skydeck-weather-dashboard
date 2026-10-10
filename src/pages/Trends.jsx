import { useQuery } from "@tanstack/react-query";
import { CloudRain, Thermometer, Wind } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import { fetchTrends } from "../api/weather";
import { useAppStore } from "../store/useAppStore";

const short = (iso) =>
  new Date(`${iso}T12:00`).toLocaleDateString([], { day: "numeric", month: "short" });

function ChartCard({ title, icon, label, className = "", children }) {
  return (
    <Card title={title} icon={icon} className={className}>
      <div role="img" aria-label={label} className="h-56 w-full min-w-0 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </Card>
  );
}

const axis = { tick: { fontSize: 11 }, axisLine: false, tickLine: false };

export default function Trends() {
  const { city, unit } = useAppStore();
  const { data, isError, refetch } = useQuery({
    queryKey: ["trends", city.latitude, city.longitude, unit],
    queryFn: () => fetchTrends(city, unit),
    staleTime: 30 * 60 * 1000,
  });

  if (isError) {
    return (
      <div role="alert" className="rounded-2xl bg-red-600 p-4 text-white">
        Couldn't load trends.{" "}
        <button className="h-11 underline" onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
  if (!data) return <Skeleton className="h-72" />;

  const d = data.daily;
  const rainUnit = data.daily_units.precipitation_sum;
  const windUnit = data.daily_units.wind_speed_10m_max;
  const rows = d.time.map((t, i) => ({
    day: short(t),
    max: Math.round(d.temperature_2m_max[i]),
    min: Math.round(d.temperature_2m_min[i]),
    rain: d.precipitation_sum[i] ?? 0,
    wind: Math.round(d.wind_speed_10m_max[i]),
  }));
  const hottest = rows.reduce((a, b) => (b.max > a.max ? b : a));
  const wettest = rows.reduce((a, b) => (b.rain > a.rain ? b : a));
  const totalRain = rows.reduce((s, r) => s + r.rain, 0).toFixed(1);

  const stats = [
    ["Hottest day", `${hottest.max}°`, hottest.day],
    ["Wettest day", `${wettest.rain} ${rainUnit}`, wettest.day],
    ["Total rain (16 days)", `${totalRain} ${rainUnit}`, ""],
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:col-span-2">
        {stats.map(([title, value, sub]) => (
          <Card key={title} title={title}>
            <p className="text-2xl font-semibold">{value}</p>
            {sub && <p className="text-xs text-slate-600 dark:text-slate-400">{sub}</p>}
          </Card>
        ))}
      </div>

      <ChartCard
        className="lg:col-span-2"
        title="Temperature · next 16 days"
        icon={Thermometer}
        label={`Line chart of daily high and low temperature for 16 days. Hottest day ${hottest.day} at ${hottest.max}°.`}
      >
        <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="day" minTickGap={24} {...axis} />
          <YAxis unit="°" width={38} {...axis} />
          <Tooltip />
          <Line type="monotone" dataKey="max" name="High" stroke="#f97316" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="min" name="Low" stroke="#38bdf8" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartCard>

      <ChartCard
        title="Precipitation"
        icon={CloudRain}
        label={`Bar chart of daily precipitation. Wettest day ${wettest.day}, ${wettest.rain} ${rainUnit}.`}
      >
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="day" minTickGap={24} {...axis} />
          <YAxis width={38} {...axis} />
          <Tooltip />
          <Bar dataKey="rain" name={`Rain (${rainUnit})`} fill="#38bdf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Max wind speed" icon={Wind} label="Bar chart of daily maximum wind speed for 16 days.">
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="day" minTickGap={24} {...axis} />
          <YAxis width={38} {...axis} />
          <Tooltip />
          <Bar dataKey="wind" name={`Wind (${windUnit})`} fill="#a78bfa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartCard>
    </div>
  );
}