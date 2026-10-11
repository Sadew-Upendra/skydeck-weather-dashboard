<div align="center">

<img src="public/favicon.svg" width="96" alt="SkyDeck logo" />

# SkyDeck – Weather Dashboard

**A fast, responsive, installable weather dashboard with hourly & 16-day forecasts, air quality, live radar and dynamic themes.**

![CI](https://github.com/Sadew-Upendra/skydeck-weather-dashboard/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8)

[**Live demo**](https://skydeck-weather-dashboard.vercel.app) · [Report a bug](../../issues) · [Request a feature](../../issues)

</div>

---

## Features

- 🔎 **City search** with debounced autocomplete, plus "use my location"
- 🌡️ **Current conditions**: temperature, feels-like, high/low, description
- ⏱️ **Hourly forecast** strip and a 24-hour temperature chart
- 📅 **7-day forecast** with temperature range bars and rain chance
- 📈 **Trends page**: 16-day temperature, precipitation and wind charts
- 🌬️ **Detail cards**: wind, humidity, UV index, pressure, sunrise, sunset
- 🍃 **Air quality** (US AQI, PM2.5, PM10) with a colour-coded scale
- 🛰️ **Live precipitation radar** (Leaflet + RainViewer)
- ⚖️ **Compare cities** side by side
- ⚠️ **Smart alerts** derived from the data (heat, cold, storms, wind, UV, air quality)
- ⭐ **Saved cities**, °C/°F toggle and dark/light mode (persisted locally)
- 🎨 **Dynamic themes and animated rain/snow** that follow the weather
- ⏳ **Branded splash screen**, top progress bar and skeleton loaders
- 📱 **Fully responsive** (320px phones to ultra-wide desktops, safe-area aware)
- ♿ **Accessible**: skip link, keyboard navigation, ARIA live alerts, focus rings, reduced-motion support
- 📲 **Installable PWA** with offline caching of recent weather data

## Tech stack

| Area | Tools |
|---|---|
| Framework | React (Vite), React Router |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query |
| State | Zustand (persisted to localStorage) |
| Charts | Recharts |
| Map | Leaflet, React-Leaflet |
| Icons | Lucide React |
| PWA | vite-plugin-pwa (Workbox) |
| Testing | Vitest |
| CI/CD | GitHub Actions, Vercel/Netlify |

## Data sources (all free, no API key)

| Data | Provider |
|---|---|
| Forecast, trends | [Open-Meteo](https://open-meteo.com) |
| Geocoding (city search) | [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) |
| Air quality | [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) |
| Radar tiles | [RainViewer](https://www.rainviewer.com/api.html) |
| Base map | [OpenStreetMap](https://www.openstreetmap.org/copyright) |

> **Note:** Open-Meteo's free API is for non-commercial use and requires attribution (CC BY 4.0). RainViewer's free tier has usage limits that may change, so check their docs if radar tiles stop loading.

## Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
# 1. Clone
git clone https://github.com/Sadew-Upendra/skydeck-weather-dashboard.git
cd skydeck-weather-dashboard

# 2. Install
npm install

# 3. Run the dev server
npm run dev
```

Open http://localhost:5173. No `.env` file or API keys are needed.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build (use this to test the PWA) |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests with Vitest |

## Project structure

```
skydeck-weather-dashboard/
├── .github/workflows/ci.yml
├── public/                  # favicon
├── src/
│   ├── api/weather.js       # Open-Meteo fetchers (forecast, air, geocoding, trends)
│   ├── components/
│   │   ├── ErrorBoundary.jsx
│   │   ├── charts/          # TempChart
│   │   ├── layout/          # Layout, Header, SearchBar, SavedCities
│   │   ├── map/             # RadarMap (lazy-loaded)
│   │   ├── ui/              # Card, Skeleton, PageLoader, TopLoader, WeatherBackground
│   │   └── weather/         # CurrentWeather, Hourly/Daily, DetailCards, AirQuality, AlertBanner, CompareCities
│   ├── hooks/useWeather.js
│   ├── pages/               # Dashboard, Trends, NotFound
│   ├── store/useAppStore.js # city, saved cities, unit, theme
│   ├── utils/               # weatherCodes, format, alerts, splash (+ tests)
│   ├── App.jsx              # routes
│   ├── main.jsx
│   └── index.css
├── index.html               # includes the splash screen
├── vercel.json
├── vite.config.js
└── package.json
```

## How it works

1. The **Zustand store** holds the selected city, saved cities, unit and theme, persisted in `localStorage`.
2. **TanStack Query** fetches the forecast and air quality for the selected city, caching results for 10 minutes.
3. The **Layout** derives a weather "mood" (clear day, night, rain, snow, storm…) and applies a matching gradient and animated background.
4. **Pages** are routed with React Router. Heavy parts (radar map, compare, trends) are **lazy-loaded** and wrapped in **error boundaries**.
5. A **service worker** caches the app shell and recent API responses so the app opens offline.

## Responsive design

Mobile-first with Tailwind breakpoints:

| Screen | Layout |
|---|---|
| < 640px (phones) | Single column, fluid type, 44px touch targets, scrollable strips |
| 768px+ (tablets) | Two-column grid |
| 1024px+ (desktop) | Three-column bento grid with a tall 7-day panel |

Also handled: `100dvh` for mobile browser bars, notch and home-bar safe areas, 16px form inputs (no iOS zoom), and touch-friendly map gestures (one finger scrolls the page, two fingers move the map).

## Accessibility

- Skip-to-content link and visible focus rings
- Fully keyboard-operable search, navigation and controls
- `aria-live` region for weather alerts
- Charts expose text summaries via `role="img"` and `aria-label`
- Colour contrast checked on cards and alert banners
- Respects `prefers-reduced-motion` (animations are disabled)

## Testing

```bash
npm test
```

Unit tests cover the formatting helpers (compass, AQI/UV levels, hourly slicing) and the alert rules, including °F conversion.

## Deployment

**Vercel:** import the repo, accept the Vite defaults (build `npm run build`, output `dist`) and deploy. `vercel.json` handles SPA routing.

After deploying, update the live-demo link in this README.

## Roadmap

- [ ] Weather alerts from official feeds
- [ ] Animated radar playback
- [ ] Multi-language support
- [ ] Hourly "what to wear" suggestions
- [ ] Widgets and home-screen shortcuts


## Acknowledgements

- Weather data by [Open-Meteo.com](https://open-meteo.com) (CC BY 4.0)
- Radar imagery by [RainViewer](https://www.rainviewer.com)
- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Icons by [Lucide](https://lucide.dev)

## License

Released under the [MIT License](LICENSE).