import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_CITY = {
  name: "Colombo",
  country: "Sri Lanka",
  latitude: 6.9271,
  longitude: 79.8612,
};

export const useAppStore = create(
  persist(
    (set) => ({
      city: DEFAULT_CITY,
      saved: [],
      compare: [],
      unit: "C",
      theme: "dark",
      setCity: (city) => set({ city }),
      setCompare: (compare) => set({ compare }),
      toggleUnit: () => set((s) => ({ unit: s.unit === "C" ? "F" : "C" })),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      toggleSaved: (c) =>
        set((s) => {
          const same = (x) => x.latitude === c.latitude && x.longitude === c.longitude;
          return {
            saved: s.saved.some(same) ? s.saved.filter((x) => !same(x)) : [...s.saved, c],
          };
        }),
    }),
    { name: "skydeck-store" }
  )
);
