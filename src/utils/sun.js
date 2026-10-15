const ms = (iso) => new Date(iso).getTime();

export function formatDuration(diff) {
  const mins = Math.max(0, Math.round(diff / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h} h ${m} m` : `${m} m`;
}

export function getSunInfo(data) {
  const { daily, current } = data;
  const now = ms(current.time);
  const rise = ms(daily.sunrise[0]);
  const set = ms(daily.sunset[0]);

  const progress = Math.min(1, Math.max(0, (now - rise) / (set - rise)));
  const isUp = now >= rise && now <= set;

  let status;
  if (now < rise) status = `Sunrise in ${formatDuration(rise - now)}`;
  else if (now <= set) status = `Sunset in ${formatDuration(set - now)}`;
  else if (daily.sunrise[1]) status = `Sunrise in ${formatDuration(ms(daily.sunrise[1]) - now)}`;
  else status = "The sun has set";

  return {
    sunrise: daily.sunrise[0],
    sunset: daily.sunset[0],
    progress,
    isUp,
    daylight: formatDuration(set - rise),
    status,
  };
}