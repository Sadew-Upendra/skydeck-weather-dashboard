import { Thermometer } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../ui/Card";
import { nextHours } from "../../utils/format";

export default function TempChart({ data, className = "" }) {
  const rows = nextHours(data);
  return (
    <Card title="Temperature (24h)" icon={Thermometer} className={className}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={rows}>
          <defs>
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={3} axisLine={false} tickLine={false} />
          <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
          <Tooltip formatter={(v) => [`${v}°`, "Temp"]} />
          <Area type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2} fill="url(#tempFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}